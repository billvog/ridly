import functools


def command(event_name):
  """
  Registers a function to be the handler of a specific command within a module.
  """

  def wrapper(func):
    @functools.wraps(func)
    async def wrapped(self, *args):
      return await func(self, *args)

    wrapped._command = event_name
    return wrapped

  return wrapper
