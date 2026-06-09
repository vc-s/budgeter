from typing import Optional
from pydantic import BaseModel, Field

class BucketData(BaseModel):
    id: int = Field(gt=0)
    name: str
    balance: int = Field(default=0, ge=0)
    cap: int = Field(gt=0)
    
class BucketCreate(BaseModel):
    name: str
    cap: int = Field(gt=0, description="Cap must be greater than 0")

class UpdateBucketDetails(BaseModel):
    id: int = Field(gt=0)
    newname: Optional[str] = None
    balance: Optional[int] = Field(default=None, ge=0, description="Balance must not be less than zero")
    cap: Optional[int] = Field(default=None, gt=0, description="Cap must be greater than 0")

class UpdateBucketBalance(BaseModel):
    id: int = Field(gt=0)
    amount: int
    isFill: bool = Field(default=False)

class TransferData(BaseModel):
    sourceID: int
    destinationID: int
    amount: int = Field(gt=0, description="Amount must be greater than zero")