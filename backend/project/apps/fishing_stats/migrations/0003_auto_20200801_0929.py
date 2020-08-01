# Generated by Django 3.0.8 on 2020-08-01 09:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('fishing_stats', '0002_fishingevent_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='fishcatch',
            name='amount',
        ),
        migrations.AddField(
            model_name='fishcatch',
            name='fish_details',
            field=models.TextField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='fishcatch',
            name='lure',
            field=models.CharField(blank=True, choices=[('Jig', 'Jigi'), ('Spinner', 'Lippa'), ('Spoon lure', 'Lusikka'), ('Wobbler', 'Vaappu'), (None, 'Ei viehettä')], default=None, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='fishcatch',
            name='lure_details',
            field=models.TextField(blank=True, default=None, null=True),
        ),
        migrations.CreateModel(
            name='FishingTechnique',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fishing_method', models.CharField(blank=True, choices=[('Casting', 'Heittokalastus'), ('Fly fishing', 'Perhokalastus'), ('Trolling', 'Vetouistelu'), ('Net fishing', 'Verkko'), ('Pole fishing', 'Onki')], default=None, max_length=20, null=True)),
                ('method_details', models.TextField(blank=True, default=None, null=True)),
                ('fishing_event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stats', to='fishing_stats.FishingEvent')),
            ],
        ),
        migrations.AlterField(
            model_name='fishcatch',
            name='fishing_event',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='catches', to='fishing_stats.FishingTechnique'),
        ),
    ]
