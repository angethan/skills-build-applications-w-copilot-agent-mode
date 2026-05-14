from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Team, Activity, Leaderboard, Workout
from .serializers import UserSerializer, TeamSerializer, ActivitySerializer, LeaderboardSerializer, WorkoutSerializer

class UserViewSet(viewsets.ModelViewSet):
	queryset = get_user_model().objects.all()
	serializer_class = UserSerializer

class TeamViewSet(viewsets.ModelViewSet):
	queryset = Team.objects.all()
	serializer_class = TeamSerializer

class ActivityViewSet(viewsets.ModelViewSet):
	queryset = Activity.objects.all()
	serializer_class = ActivitySerializer

class LeaderboardViewSet(viewsets.ModelViewSet):
	queryset = Leaderboard.objects.all()
	serializer_class = LeaderboardSerializer

class WorkoutViewSet(viewsets.ModelViewSet):
	queryset = Workout.objects.all()
	serializer_class = WorkoutSerializer

@api_view(['GET'])
def api_root(request, format=None):
	return Response({
		'users': request.build_absolute_uri('users/'),
		'teams': request.build_absolute_uri('teams/'),
		'activities': request.build_absolute_uri('activities/'),
		'leaderboard': request.build_absolute_uri('leaderboard/'),
		'workouts': request.build_absolute_uri('workouts/'),
	})
