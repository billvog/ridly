from channels.generic.websocket import AsyncJsonWebsocketConsumer
from hunt.exceptions import ConsumerException


class BaseModuleMeta(type):
  def __new__(cls, clsname, bases, attrs):
    newclass = super().__new__(cls, clsname, bases, attrs)
    newclass._commands = {}
    for val in attrs.values():
      command = getattr(val, "_command", None)
      if command is not None:
        newclass._commands[command] = val
    return newclass


class BaseModule(metaclass=BaseModuleMeta):
  prefix = None

  def __init__(self, consumer: AsyncJsonWebsocketConsumer):
    self.consumer = consumer

  async def dispatch_command(self, content):
    action = content[0].split(".", 1)[1]
    if action not in self._commands:
      raise ConsumerException(f"{self.prefix}.unsupported_command")
    await self._commands[action](self, content[2])
