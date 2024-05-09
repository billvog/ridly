from django.contrib import admin

from .models import Hunt, HuntClue


class TreasureHuntClueInline(admin.StackedInline):
  extra = 0
  model = HuntClue


class TreasureHuntAdmin(admin.ModelAdmin):
  inlines = [
    TreasureHuntClueInline,
  ]


admin.site.register(Hunt, TreasureHuntAdmin)
admin.site.register(HuntClue)
