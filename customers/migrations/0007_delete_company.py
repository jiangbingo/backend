# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-04-09 09:01
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0006_remove_company_brands'),
        ('products', '0023_auto_20160409_0901'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Company',
        ),
    ]