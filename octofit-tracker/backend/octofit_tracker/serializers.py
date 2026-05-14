from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Team, Activity, Leaderboard, Workout

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = get_user_model()
		fields = ['id', 'username', 'email', 'first_name', 'last_name']

class TeamSerializer(serializers.ModelSerializer):
	class Meta:
		model = Team
		fields = ['id', 'name']

class ActivitySerializer(serializers.ModelSerializer):
	user = UserSerializer(read_only=True)
	team = TeamSerializer(read_only=True)
	class Meta:
		model = Activity
		fields = ['id', 'user', 'activity_type', 'duration', 'team']

class LeaderboardSerializer(serializers.ModelSerializer):
	team = TeamSerializer(read_only=True)
	class Meta:
		model = Leaderboard
		fields = ['id', 'team', 'points']

class WorkoutSerializer(serializers.ModelSerializer):
	class Meta:
		model = Workout
		fields = ['id', 'name', 'difficulty']
