FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install pandas scikit-learn numpy joblib
EXPOSE 5001
CMD ["python", "scripts/ai_inference_service.py"]
