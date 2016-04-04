# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-04-04 03:37
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0010_auto_20160331_0615'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='productcategorysearch',
            name='category',
        ),
        migrations.RemoveField(
            model_name='productcategorysearchvalue',
            name='search',
        ),
        migrations.RenameField(
            model_name='productcategoryattributevalue',
            old_name='name',
            new_name='value',
        ),
        migrations.RemoveField(
            model_name='productcategoryattribute',
            name='create_time',
        ),
        migrations.RemoveField(
            model_name='productcategoryattribute',
            name='status',
        ),
        migrations.RemoveField(
            model_name='productcategoryattribute',
            name='update_time',
        ),
        migrations.RemoveField(
            model_name='productcategoryattribute',
            name='value',
        ),
        migrations.RemoveField(
            model_name='productcategoryattributevalue',
            name='create_time',
        ),
        migrations.RemoveField(
            model_name='productcategoryattributevalue',
            name='parent_id',
        ),
        migrations.RemoveField(
            model_name='productcategoryattributevalue',
            name='status',
        ),
        migrations.RemoveField(
            model_name='productcategoryattributevalue',
            name='update_time',
        ),
        migrations.AddField(
            model_name='productcategoryattributevalue',
            name='series',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='attribute_values', to='products.ProductBrandSeries'),
        ),
        migrations.DeleteModel(
            name='ProductCategorySearch',
        ),
        migrations.DeleteModel(
            name='ProductCategorySearchValue',
        ),
    ]
