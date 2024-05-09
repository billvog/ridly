from django.contrib import admin

from .models import Hunt, HuntClue


class HuntClueInline(admin.StackedInline):
  extra = 0
  model = HuntClue
  ordering = ("order",)


class HuntAdmin(admin.ModelAdmin):
  inlines = [
    HuntClueInline,
  ]


admin.site.register(Hunt, HuntAdmin)
admin.site.register(HuntClue)
