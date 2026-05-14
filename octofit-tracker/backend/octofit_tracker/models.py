from django.db import models
from django.contrib.auth import get_user_model

class Team(models.Model):
	name = models.CharField(max_length=100, unique=True)
	def __str__(self):
		return self.name

class Activity(models.Model):
	user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
	activity_type = models.CharField(max_length=100)
	duration = models.IntegerField()
	team = models.ForeignKey(Team, on_delete=models.CASCADE)
	def __str__(self):
		return f"{self.user} - {self.activity_type}"

class Leaderboard(models.Model):
	team = models.ForeignKey(Team, on_delete=models.CASCADE)
	points = models.IntegerField()
	def __str__(self):
		return f"{self.team} - {self.points}"

class Workout(models.Model):
	name = models.CharField(max_length=100)
	difficulty = models.CharField(max_length=50)
	def __str__(self):
		return self.name
