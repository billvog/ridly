from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView

from .models import TreasureHunt
from .serializers import THuntSerializer, THuntClueSerializer


class RetrieveHuntAPIView(RetrieveAPIView):
  queryset = TreasureHunt.objects.all()
  serializer_class = THuntSerializer


class RetrieveHuntClueAPIView(RetrieveAPIView):
  queryset = TreasureHunt.objects.all()
  serializer_class = THuntClueSerializer

  def get(self, request, *args, **kwargs):
    clue_order = kwargs.get("clue_order")

    hunt = self.get_object()
    clue = hunt.clues.get(order=clue_order)

    serialized_clue = self.get_serializer(clue).data

    return Response(serialized_clue, status=status.HTTP_200_OK)
