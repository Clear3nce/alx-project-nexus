from rest_framework import serializers
from django.utils import timezone
from django.core.exceptions import ValidationError
from .models import Poll, Option, Vote

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text', 'vote_count']

class PollSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)
    status = serializers.ReadOnlyField()
    
    class Meta:
        model = Poll
        fields = ['id', 'question', 'created_at', 'expires_at', 'is_active', 
                 'status', 'options', 'total_votes']

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['option', 'voter_id']
    
    def validate(self, data):
        poll = data['option'].poll
        voter_id = data['voter_id']
        
        # Check if poll is active and not expired
        if not poll.is_active:
            raise serializers.ValidationError("This poll is not active")
        
        if poll.expires_at < timezone.now():
            raise serializers.ValidationError("This poll has expired")
        
        # Check if voter has already voted in this poll
        if Vote.objects.filter(option__poll=poll, voter_id=voter_id).exists():
            raise serializers.ValidationError("You have already voted in this poll")
        
        return data

class CreatePollSerializer(serializers.ModelSerializer):
    options = serializers.ListField(
        child=serializers.CharField(max_length=255, min_length=1),
        write_only=True,
        min_length=2  # At least two options required
    )
    
    class Meta:
        model = Poll
        fields = ['question', 'expires_at', 'options']
    
    def validate_question(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("Question must be at least 10 characters long")
        return value
    
    def validate_options(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("At least two options are required")
        
        # Check for duplicate options
        if len(value) != len(set(value)):
            raise serializers.ValidationError("Options must be unique")
        
        return value
    
    def validate_expires_at(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError("Expiration date must be in the future")
        return value
    
    def create(self, validated_data):
        options_data = validated_data.pop('options')
        poll = Poll.objects.create(**validated_data)
        
        for option_text in options_data:
            Option.objects.create(poll=poll, text=option_text)
        
        return poll