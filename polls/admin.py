from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Poll, Option, Vote

@admin.register(Poll)
class PollAdmin(admin.ModelAdmin):
    list_display = ['question', 'created_at', 'expires_at', 'is_active', 'status', 'total_votes']
    list_filter = ['is_active', 'created_at']
    search_fields = ['question']

@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    list_display = ['text', 'poll', 'vote_count']
    list_filter = ['poll']
    search_fields = ['text', 'poll__question']

@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ['voter_id', 'option', 'voted_at']
    list_filter = ['voted_at', 'option__poll']
    search_fields = ['voter_id', 'option__text']