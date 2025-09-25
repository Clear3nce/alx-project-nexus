from django.core.management.base import BaseCommand
from django.utils import timezone
from polls.models import Poll, Option
import random
from datetime import timedelta

class Command(BaseCommand):
    help = 'Seed demo data with polls and options'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=5,
            help='Number of polls to create'
        )
        parser.add_argument(
            '--wipe',
            action='store_true',
            help='Delete all existing polls before seeding'
        )
    
    def handle(self, *args, **options):
        count = options['count']
        wipe = options['wipe']
        
        if wipe:
            Poll.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Deleted all existing polls'))
        
        # Sample poll questions
        poll_questions = [
            "What's your favorite programming language?",
            "Which web framework do you prefer?",
            "What's your preferred database system?",
            "Which cloud platform do you use most?",
            "What's your favorite frontend framework?",
            "Which mobile OS do you prefer?",
            "What's your favorite code editor?",
            "Which version control system do you use?",
            "What's your preferred operating system?",
            "Which browser do you primarily use?"
        ]
        
        # Sample options for polls
        poll_options = {
            "language": ["Python", "JavaScript", "Java", "C++", "Go", "Rust"],
            "framework": ["Django", "Flask", "FastAPI", "Spring", "Express"],
            "database": ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis"],
            "cloud": ["AWS", "Google Cloud", "Azure", "DigitalOcean", "Heroku"],
            "frontend": ["React", "Vue", "Angular", "Svelte", "Next.js"],
            "mobile_os": ["iOS", "Android", "Windows Mobile", "Other"],
            "editor": ["VS Code", "PyCharm", "Sublime Text", "Vim", "Emacs"],
            "vcs": ["Git", "SVN", "Mercurial", "Other"],
            "os": ["Windows", "macOS", "Linux", "BSD", "Other"],
            "browser": ["Chrome", "Firefox", "Safari", "Edge", "Opera"]
        }
        
        # Create polls
        for i in range(count):
            question = random.choice(poll_questions)
            poll_type = question.split()[-1].rstrip('?').lower()
            
            poll = Poll.objects.create(
                question=question,
                expires_at=timezone.now() + timedelta(days=random.randint(7, 30)),
                is_active=random.choice([True, True, True, False])  # Mostly active
            )
            
            # Add options
            options = poll_options.get(poll_type, ["Option 1", "Option 2", "Option 3"])
            for option_text in options:
                Option.objects.create(poll=poll, text=option_text)
            
            self.stdout.write(self.style.SUCCESS(f'Created poll: {question}'))
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created {count} polls'))