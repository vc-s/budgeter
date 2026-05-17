from typing import Optional
from pydantic import BaseModel, Field

class BucketData(BaseModel):
    id: int = Field(gt=0)
    name: str
    balance: int = Field(ge=0)
    cap: Optional[int] = Field(default=None, gt=0)
    
class BucketCreate(BaseModel):
    name: str
    balance: int = Field(ge=0)
    cap: Optional[int] = Field(default=None, gt=0)

class UpdateBucketDetails(BaseModel):
    name: str
    newname: Optional[str] = None
    amount: Optional[int] = None
    balance: Optional[int] = Field(default=None, ge=0)
    cap: Optional[int] = Field(default=None, gt=0)

class TransferData(BaseModel):
    source: str
    destination: str
    amount: int = Field(ge=0)