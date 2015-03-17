# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('swim', '0005_auto_20150124_1920'),
    ]

    operations = [
        migrations.AddField(
            model_name='workout',
            name='updated_at',
            field=models.DateTimeField(default=datetime.datetime.now),
            preserve_default=True,
        ),
    ]
