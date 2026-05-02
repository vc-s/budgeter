from fastapi import FastAPI, status, HTTPException
from typing import Optional
from pydantic import BaseModel, Field

class BucketData(BaseModel):
    balance: int = Field(ge=0)
    cap: Optional[int] = Field(default=None, gt=0)
    
class BucketCreate(BaseModel):
    name: str
    balance: int = Field(ge=0)
    cap: Optional[int] = Field(default=None, gt=0)

class UpdateBucketBalance(BaseModel):
    name: str
    amount: int

class TransferData(BaseModel):
    source: str
    destination: str
    amount: int = Field(ge=0)

app = FastAPI()

buckets = {'Transport': {'balance': 680, 'cap': 680}}

@app.get('/list-buckets')
def list_buckets():
    return buckets

@app.post('/add-bucket')
def add_bucket(data: BucketCreate):
    name = data.name
    bal = data.balance
    cap = data.cap
    buckets[name] = {'balance': bal, 'cap': cap}
    return f'Added {name} as a bucket.'

@app.delete('/remove-bucket/{bucket}')
def remove_bucket(bucket: str):
    if bucket in buckets:
        buckets.pop(bucket)
        return f'Removed bucket {bucket} !'
    raise HTTPException(
        status_code = status.HTTP_404_NOT_FOUND,
        detail = 'Bucket does not exist'
    )

@app.put('/update-balance')
def update_balance(data: UpdateBucketBalance):
    bucket = data.name
    amt = data.amount
    
    if bucket not in buckets:
        raise HTTPException(
        status_code = status.HTTP_404_NOT_FOUND,
        detail = 'Bucket does not exist'
    )
        
    cap = buckets[bucket]['cap']
    balance = buckets[bucket]['balance']
    
    if cap:
        if amt + balance > cap:
            raise HTTPException(
                status_code = status.HTTP_400_BAD_REQUEST,
                detail = 'Final balance exceeds cap'
            )
        if amt + balance < 0: 
            raise HTTPException(
                status_code = status.HTTP_400_BAD_REQUEST,
                detail = 'Final balance falls below zero'
            )
    
    buckets[bucket]['balance'] += amt
    return f"Updated {bucket}'s balance"

@app.put('/transfer')
def transfer(data: TransferData):
    src = data.source
    dest = data.destination
    amt = data.amount
    
    if src not in buckets or dest not in buckets:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = 'Bucket not found'
        )
    
    src_bal = buckets[src]['balance']
    dest_bal = buckets[dest]['balance']
    dest_cap = buckets[dest]['cap']
    
    if src_bal - amt < 0:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = f'{src} does not have enough balance'
        )
    
    if dest_cap:
        if dest_bal + amt > dest_cap:
            raise HTTPException(
                status_code = status.HTTP_400_BAD_REQUEST,
                detail = f'Total money in {dest} exceeds its cap !'
            )
    
    buckets[src]['balance'] -= amt
    buckets[dest]['balance'] += amt
    return f'Transferred {amt} from {src} to {dest}'

# TODO: add route to update bucket details, like change balance directly, change name, change cap, etc

# def main():
#     intro = '''
#     Hello, and welcome to the best budgeting app of all time !!
#     Select one of the options below to continue !!'''
#     options = '''
#     1. Add a bucket
#     2. Remove a bucket
#     3. Add money to a bucket
#     4. Remove money from a bucket
#     5. Transfer money from one bucket to another
#     6. List buckets
#     7. Exit'''
#     print(intro)
#     while True:
#         print(options)
#         inp = int(input('\nEnter your option: '))
#         match inp:
#             case 1:
#                 name = input('Enter the name of the bucket: ')
#                 cap_exists = input('Does this bucket have a cap ? (Y/N): ')
#                 if cap_exists.upper() == 'Y': cap = int(input('Enter cap: '))
#                 else: cap = None
#                 balance = int(input('Enter current balance of the bucket: '))
#                 info = {
#                     'balance': balance,
#                     'cap': cap
#                 }
#                 result = add_bucket(name, info)
#                 print(result)
            
#             case 2:
#                 name = input('Enter the name of the bucket: ')
#                 result = remove_bucket(name)
#                 print(result)
            
#             case 3:
#                 name = input('Enter the name of the bucket: ')
#                 amt = int(input('Enter amount to be added to the bucket: '))
#                 result = add_to_bucket(name, amt)
#                 print(result)
            
#             case 4:
#                 name = input('Enter the name of the bucket: ')
#                 amt = int(input('Enter amount to be removed from the bucket: '))
#                 result = remove_from_bucket(name, amt)
#                 print(result)
            
#             case 5:
#                 src = input('Enter the bucket you want to transfer FROM: ')
#                 dest = input('Enter the bucket you want to transfer TO: ')
#                 amt = int(input('Enter the amount to be transferred: '))
#                 result = transfer(src, dest, amt)
#                 print(result)
            
#             case 6:
#                 list_buckets()
            
#             case 7:
#                 print('\nThanks for using our app !!')
#                 break
            
#             case _: print("\nSorry, that's not a valid option ! Try again !!")
#         print('\nWhat do you want to do today ?')

# main()