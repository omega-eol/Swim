# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('swim', '0003_auto_20150110_0120'),
    ]

    operations = [
        migrations.AddField(
            model_name='workout',
            name='description',
            field=models.CharField(default='', blank=True, max_length=2048),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='exercise',
            name='stroke',
            field=models.CharField(default='Free', max_length=42),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='exercise',
            name='type',
            field=models.CharField(default='Swim', max_length=42),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='exerciseset',
            name='repetitions',
            field=models.PositiveSmallIntegerField(default=1),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='workout',
            name='crated_at',
            field=models.DateTimeField(default=datetime.datetime.now),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='workout',
            name='name',
            field=models.CharField(blank=True, max_length=255),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='workoutset',
            name='repetitions',
            field=models.PositiveSmallIntegerField(default=1),
            preserve_default=True,
        ),
    ]
