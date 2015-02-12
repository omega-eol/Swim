# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('swim', '0004_auto_20150111_0343'),
    ]

    operations = [
        migrations.RenameField(
            model_name='workout',
            old_name='crated_at',
            new_name='created_at',
        ),
        migrations.AlterField(
            model_name='exerciseset',
            name='exercise',
            field=models.ForeignKey(to='swim.Exercise', related_name='exerciseSets'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='exerciseset',
            name='workoutSet',
            field=models.ForeignKey(to='swim.WorkoutSet', related_name='exerciseSets'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='workoutset',
            name='workout',
            field=models.ForeignKey(to='swim.Workout', related_name='workoutSets'),
            preserve_default=True,
        ),
    ]
