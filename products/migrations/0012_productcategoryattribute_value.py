# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-04-04 07:35
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0011_auto_20160404_0337'),
    ]

    operations = [
        migrations.AddField(
            model_name='productcategoryattribute',
            name='value',
            field=models.TextField(default=[]),
            preserve_default=False,
        ),
    ]
