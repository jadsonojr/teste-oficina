from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date
import os
import uuid
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import DuplicateKeyError
import json

# Environment variables
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

app = FastAPI(title="Gestão Oficina Mecânica", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB client
client = AsyncIOMotorClient(MONGO_URL)
db = client.oficina_mecanica

# Pydantic models
class Customer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)

class CustomerCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None

class Part(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    reference_code: str
    cost_price: float
    sale_price: float
    stock_quantity: int
    created_at: datetime = Field(default_factory=datetime.now)

class PartCreate(BaseModel):
    name: str
    description: Optional[str] = None
    reference_code: str
    cost_price: float
    sale_price: float
    stock_quantity: int

class PartUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    reference_code: Optional[str] = None
    cost_price: Optional[float] = None
    sale_price: Optional[float] = None
    stock_quantity: Optional[int] = None

class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    price: float
    created_at: datetime = Field(default_factory=datetime.now)

class ServiceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None

class SaleItem(BaseModel):
    type: str  # "part" or "service"
    id: str
    name: str
    price: float
    quantity: int
    subtotal: float

class Sale(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sale_number: str
    date: datetime
    customer_id: Optional[str] = None
    customer_data: Optional[dict] = None
    items: List[SaleItem]
    subtotal_parts: float
    subtotal_services: float
    total: float
    created_at: datetime = Field(default_factory=datetime.now)

class SaleCreate(BaseModel):
    customer_id: Optional[str] = None
    items: List[SaleItem]

class Setting(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    key: str
    value: Any
    updated_at: datetime = Field(default_factory=datetime.now)

class SettingUpdate(BaseModel):
    value: Any

# Utility functions
async def generate_sale_number():
    today = datetime.now().strftime("%Y%m%d")
    
    # Find the last sale number for today
    last_sale = await db.sales.find_one(
        {"sale_number": {"$regex": f"^{today}"}}, 
        sort=[("sale_number", -1)]
    )
    
    if last_sale:
        last_number = int(last_sale["sale_number"][-3:])
        new_number = last_number + 1
    else:
        new_number = 1
    
    return f"{today}{new_number:03d}"

# Default settings
DEFAULT_SETTINGS = {
    "low_stock_threshold": 5,
    "workshop_name": "Oficina Mecânica",
    "workshop_address": "Endereço da Oficina",
    "workshop_phone": "Telefone da Oficina",
    "workshop_logo": ""
}

async def initialize_settings():
    for key, value in DEFAULT_SETTINGS.items():
        existing = await db.settings.find_one({"key": key})
        if not existing:
            setting = Setting(key=key, value=value)
            await db.settings.insert_one(setting.model_dump())

# Startup event
@app.on_event("startup")
async def startup_event():
    await initialize_settings()

# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# Customer endpoints
@app.get("/api/customers", response_model=List[Customer])
async def get_customers():
    customers = await db.customers.find().to_list(1000)
    return customers

@app.post("/api/customers", response_model=Customer)
async def create_customer(customer: CustomerCreate):
    customer_data = Customer(**customer.model_dump())
    await db.customers.insert_one(customer_data.model_dump())
    return customer_data

@app.get("/api/customers/{customer_id}", response_model=Customer)
async def get_customer(customer_id: str):
    customer = await db.customers.find_one({"id": customer_id})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@app.put("/api/customers/{customer_id}", response_model=Customer)
async def update_customer(customer_id: str, customer_update: CustomerUpdate):
    update_data = {k: v for k, v in customer_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.customers.update_one(
        {"id": customer_id}, 
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    customer = await db.customers.find_one({"id": customer_id})
    return customer

@app.delete("/api/customers/{customer_id}")
async def delete_customer(customer_id: str):
    result = await db.customers.delete_one({"id": customer_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"message": "Customer deleted successfully"}

# Parts endpoints
@app.get("/api/parts", response_model=List[Part])
async def get_parts():
    parts = await db.parts.find().to_list(1000)
    return parts

@app.post("/api/parts", response_model=Part)
async def create_part(part: PartCreate):
    part_data = Part(**part.model_dump())
    await db.parts.insert_one(part_data.model_dump())
    return part_data

@app.get("/api/parts/low-stock")
async def get_low_stock_parts():
    threshold_setting = await db.settings.find_one({"key": "low_stock_threshold"})
    threshold = threshold_setting["value"] if threshold_setting else 5
    
    parts = await db.parts.find({"stock_quantity": {"$lte": threshold}}).to_list(1000)
    return parts

@app.get("/api/parts/{part_id}", response_model=Part)
async def get_part(part_id: str):
    part = await db.parts.find_one({"id": part_id})
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")
    return part

@app.put("/api/parts/{part_id}", response_model=Part)
async def update_part(part_id: str, part_update: PartUpdate):
    update_data = {k: v for k, v in part_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.parts.update_one(
        {"id": part_id}, 
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Part not found")
    
    part = await db.parts.find_one({"id": part_id})
    return part

@app.delete("/api/parts/{part_id}")
async def delete_part(part_id: str):
    result = await db.parts.delete_one({"id": part_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Part not found")
    return {"message": "Part deleted successfully"}

# Services endpoints
@app.get("/api/services", response_model=List[Service])
async def get_services():
    services = await db.services.find().to_list(1000)
    return services

@app.post("/api/services", response_model=Service)
async def create_service(service: ServiceCreate):
    service_data = Service(**service.model_dump())
    await db.services.insert_one(service_data.model_dump())
    return service_data

@app.get("/api/services/{service_id}", response_model=Service)
async def get_service(service_id: str):
    service = await db.services.find_one({"id": service_id})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@app.put("/api/services/{service_id}", response_model=Service)
async def update_service(service_id: str, service_update: ServiceUpdate):
    update_data = {k: v for k, v in service_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.services.update_one(
        {"id": service_id}, 
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    
    service = await db.services.find_one({"id": service_id})
    return service

@app.delete("/api/services/{service_id}")
async def delete_service(service_id: str):
    result = await db.services.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"message": "Service deleted successfully"}

# Sales endpoints
@app.get("/api/sales", response_model=List[Sale])
async def get_sales():
    sales = await db.sales.find().sort("created_at", -1).to_list(1000)
    return sales

@app.post("/api/sales", response_model=Sale)
async def create_sale(sale: SaleCreate):
    # Generate sale number
    sale_number = await generate_sale_number()
    
    # Get customer data if customer_id is provided
    customer_data = None
    if sale.customer_id:
        customer = await db.customers.find_one({"id": sale.customer_id})
        if customer:
            customer_data = {
                "name": customer["name"],
                "phone": customer["phone"],
                "email": customer.get("email"),
                "address": customer.get("address")
            }
    
    # Calculate totals
    subtotal_parts = sum(item.subtotal for item in sale.items if item.type == "part")
    subtotal_services = sum(item.subtotal for item in sale.items if item.type == "service")
    total = subtotal_parts + subtotal_services
    
    # Create sale
    sale_data = Sale(
        sale_number=sale_number,
        date=datetime.now(),
        customer_id=sale.customer_id,
        customer_data=customer_data,
        items=sale.items,
        subtotal_parts=subtotal_parts,
        subtotal_services=subtotal_services,
        total=total
    )
    
    # Update stock for parts
    for item in sale.items:
        if item.type == "part":
            await db.parts.update_one(
                {"id": item.id},
                {"$inc": {"stock_quantity": -item.quantity}}
            )
    
    await db.sales.insert_one(sale_data.model_dump())
    return sale_data

@app.get("/api/sales/{sale_id}", response_model=Sale)
async def get_sale(sale_id: str):
    sale = await db.sales.find_one({"id": sale_id})
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale

# Settings endpoints
@app.get("/api/settings")
async def get_settings():
    settings = await db.settings.find().to_list(1000)
    return {setting["key"]: setting["value"] for setting in settings}

@app.put("/api/settings/{key}")
async def update_setting(key: str, setting_update: SettingUpdate):
    result = await db.settings.update_one(
        {"key": key},
        {"$set": {"value": setting_update.value, "updated_at": datetime.now()}}
    )
    
    if result.matched_count == 0:
        # Create new setting if it doesn't exist
        setting = Setting(key=key, value=setting_update.value)
        await db.settings.insert_one(setting.model_dump())
    
    return {"message": "Setting updated successfully"}

# Reports endpoints
@app.get("/api/reports/sales")
async def get_sales_report(start_date: str, end_date: str):
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d").date()
        end = datetime.strptime(end_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    sales = await db.sales.find({
        "date": {"$gte": start, "$lte": end}
    }).to_list(1000)
    
    total_sales = len(sales)
    total_revenue = sum(sale["total"] for sale in sales)
    parts_revenue = sum(sale["subtotal_parts"] for sale in sales)
    services_revenue = sum(sale["subtotal_services"] for sale in sales)
    
    return {
        "period": {"start": start_date, "end": end_date},
        "total_sales": total_sales,
        "total_revenue": total_revenue,
        "parts_revenue": parts_revenue,
        "services_revenue": services_revenue,
        "sales": sales
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)