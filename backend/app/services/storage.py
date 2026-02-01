import shutil
import os
import uuid
from fastapi import UploadFile
from abc import ABC, abstractmethod

class StorageService(ABC):
    @abstractmethod
    async def upload_file(self, file: UploadFile) -> str:
        pass

class LocalStorage(StorageService):
    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    async def upload_file(self, file: UploadFile) -> str:
        # Generate unique filename
        ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        unique_name = f"{uuid.uuid4()}.{ext}"
        file_path = os.path.join(self.upload_dir, unique_name)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return file_path

# Factory or singleton
def get_storage_service() -> StorageService:
    # In production, we would switch based on env var (e.g., S3)
    return LocalStorage()
