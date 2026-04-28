import pytest

@pytest.mark.asyncio
async def test_get_all_beaches(client):
    # This simulates a GET request to your backend
    response = await client.get("/") # Adjust path to your actual route
    
    assert response.status_code == 200
    # Check if the response is a list (typical for a forecast app)
    assert isinstance(response.json(), dict)

    assert response.json() == {"message": "Surf Forecast API"}