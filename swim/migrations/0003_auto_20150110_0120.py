# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('swim', '0002_auto_20150110_0048'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExerciseSet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('order', models.PositiveSmallIntegerField()),
                ('repetitions', models.PositiveSmallIntegerField()),
                ('exercise', models.ForeignKey(to='swim.Exercise')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Workout',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=2048)),
                ('crated_at', models.DateTimeField()),
                ('type', models.CharField(max_length=42)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='WorkoutSet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('order', models.PositiveSmallIntegerField()),
                ('repetitions', models.PositiveSmallIntegerField()),
                ('type', models.CharField(max_length=42)),
                ('workout', models.ForeignKey(to='swim.Workout')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='exerciseset',
            name='workoutSet',
            field=models.ForeignKey(to='swim.WorkoutSet'),
            preserve_default=True,
        ),
    ]
