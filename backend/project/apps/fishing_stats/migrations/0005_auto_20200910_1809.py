# Generated by Django 3.0.8 on 2020-09-10 18:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fishing_stats', '0004_auto_20200801_0931'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fishcatch',
            name='fish_species',
            field=models.CharField(blank=True, choices=[('Bream', 'Lahna'), ('Perch', 'Ahven'), ('Pike', 'Hauki'), ('Roach', 'Särki'), ('White fish', 'Siika'), ('Zander', 'Kuha'), ('Default', 'Muu')], default=None, max_length=20, null=True),
        ),
    ]