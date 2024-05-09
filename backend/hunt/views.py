from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView

from .models import Hunt
from .serializers import HuntSerializer, HuntClueSerializer


class RetrieveHuntAPIView(RetrieveAPIView):
  queryset = Hunt.objects.all()
  serializer_class = HuntSerializer


class RetrieveHuntClueAPIView(RetrieveAPIView):
  queryset = Hunt.objects.all()
  serializer_class = HuntClueSerializer

  def get(self, request, *args, **kwargs):
    clue_order = kwargs.get("clue_order")

    hunt = self.get_object()
    clue = hunt.clues.get(order=clue_order)

    serialized_clue = self.get_serializer(clue).data

    return Response(serialized_clue, status=status.HTTP_200_OK)
