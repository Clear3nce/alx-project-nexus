from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
import uuid
from django.db.models import Sum

class Poll(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.CharField(max_length=255, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    expires_at = models.DateTimeField(db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    total_votes = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['is_active', 'expires_at']),
        ]
    
    def __str__(self):
        return self.question
    
    def save(self, *args, **kwargs):
        if self.pk:
            self.total_votes = self.options.aggregate(
                total=Sum('vote_count')
            )['total'] or 0
        super().save(*args, **kwargs)
    
    @property
    def status(self):
        if not self.is_active:
            return "inactive"
        elif self.expires_at < timezone.now():
            return "expired"
        else:
            return "active"

class Option(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    poll = models.ForeignKey(Poll, related_name='options', on_delete=models.CASCADE, db_index=True)
    text = models.CharField(max_length=255)
    vote_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['id']
        indexes = [
            models.Index(fields=['poll', 'vote_count']),
        ]
    
    def __str__(self):
        return f"{self.poll.question} - {self.text}"

class Vote(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    option = models.ForeignKey(Option, related_name='votes', on_delete=models.CASCADE, db_index=True)
    voter_id = models.CharField(max_length=255, db_index=True)
    voted_at = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        ordering = ['-voted_at']
        indexes = [
            models.Index(fields=['voter_id', 'voted_at']),
        ]
    
    def __str__(self):
        return f"Vote for {self.option.text} by {self.voter_id}"
    
    def clean(self):
        if Vote.objects.filter(option__poll=self.option.poll, voter_id=self.voter_id).exists():
            raise ValidationError("You have already voted in this poll")
    
    def save(self, *args, **kwargs):
        self.clean()
        
        if not self.pk:
            self.option.vote_count += 1
            self.option.save()
            self.option.poll.total_votes += 1
            self.option.poll.save()
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        self.option.vote_count -= 1
        self.option.save()
        self.option.poll.total_votes -= 1
        self.option.poll.save()
        super().delete(*args, **kwargs)