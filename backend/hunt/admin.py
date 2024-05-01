from django.contrib import admin

from .models import TreasureHunt, TreasureHuntClue


class TreasureHuntClueInline(admin.StackedInline):
  extra = 0
  model = TreasureHuntClue


class TreasureHuntAdmin(admin.ModelAdmin):
  inlines = [
    TreasureHuntClueInline,
  ]


admin.site.register(TreasureHunt, TreasureHuntAdmin)
admin.site.register(TreasureHuntClue)
