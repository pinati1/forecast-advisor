import pytest
from httpx import AsyncClient, ASGITransport  # Add ASGITransport here
from main import app

@pytest.fixture
async def client():
    # We now wrap the app in an ASGITransport
    async with AsyncClient(
        transport=ASGITransport(app=app), 
        base_url="http://test"
    ) as ac:
        yield ac