from django.shortcuts import render

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Poll, Option, Vote
from .serializers import PollSerializer, VoteSerializer, CreatePollSerializer

"""
    API endpoint for managing polls.
    
    list:
    Return all polls.
    
    create:
    Create a new poll.
    
    retrieve:
    Return a specific poll.
    
    update:
    Update a poll.
    
    partial_update:
    Partially update a poll.
    
    destroy:
    Delete a poll.
"""

class PollViewSet(viewsets.ModelViewSet):
    
    queryset = Poll.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['question']
    ordering_fields = ['created_at', 'expires_at']
    
    filter_backends = [SearchFilter, OrderingFilter]  # Remove DjangoFilterBackend temporarily
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreatePollSerializer
        return PollSerializer
    
    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        poll = self.get_object()
        serializer = VoteSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'vote recorded'})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        poll = self.get_object()
        serializer = PollSerializer(poll)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        active_polls = Poll.objects.filter(
            is_active=True, 
            expires_at__gt=timezone.now()
        )
        page = self.paginate_queryset(active_polls)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(active_polls, many=True)
        return Response(serializer.data)

# Create your views here.
