from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.conf import settings
from django.db import connection
from octofit_tracker.models import Team, Activity, Leaderboard, Workout
from pymongo import ASCENDING

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        User = get_user_model()
        # Delete all data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        # Create teams
        marvel = Team.objects.create(name='Marvel')
        dc = Team.objects.create(name='DC')

        # Create users
        users = {
            'ironman': User.objects.create_user(username='ironman', email='ironman@marvel.com', password='pass', first_name='Tony', last_name='Stark'),
            'captainamerica': User.objects.create_user(username='captainamerica', email='cap@marvel.com', password='pass', first_name='Steve', last_name='Rogers'),
            'batman': User.objects.create_user(username='batman', email='batman@dc.com', password='pass', first_name='Bruce', last_name='Wayne'),
            'wonderwoman': User.objects.create_user(username='wonderwoman', email='wonderwoman@dc.com', password='pass', first_name='Diana', last_name='Prince'),
        }

        # Create activities with proper ForeignKey relationships
        Activity.objects.create(user=users['ironman'], activity_type='Running', duration=30, team=marvel)
        Activity.objects.create(user=users['captainamerica'], activity_type='Cycling', duration=45, team=marvel)
        Activity.objects.create(user=users['batman'], activity_type='Swimming', duration=25, team=dc)
        Activity.objects.create(user=users['wonderwoman'], activity_type='Yoga', duration=60, team=dc)

        # Create leaderboard with proper ForeignKey relationships
        Leaderboard.objects.create(team=marvel, points=75)
        Leaderboard.objects.create(team=dc, points=85)

        # Create workouts
        Workout.objects.create(name='Pushups', difficulty='Easy')
        Workout.objects.create(name='Pullups', difficulty='Medium')
        Workout.objects.create(name='Squats', difficulty='Easy')
        Workout.objects.create(name='Deadlift', difficulty='Hard')

        # Ensure unique index on email for auth_user collection
        # connection.connection is a pymongo.MongoClient, so get the db and collection
        try:
            db = connection.connection[settings.DATABASES['default']['NAME']]
            db['auth_user'].create_index([('email', ASCENDING)], unique=True)
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'Could not create MongoDB index: {e}'))

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
