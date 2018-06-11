cd frontend
npm run build
cd ..
rm -r backend/static
rm -r backend/templates
mkdir backend/static
mkdir backend/templates
cp -r frontend/dist/* backend/static
cp frontend/dist/index.html backend/templates

python3 build.py

cd backend
go build

supervisorctl restart physics
