from django.core.management.base import BaseCommand
from polls.models import Poll

class Command(BaseCommand):
    help = 'Clear all demo polls'
    
    def handle(self, *args, **options):
        count, _ = Poll.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'Deleted {count} polls'))