#!/usr/bin/env python3
"""
Backend API Testing for Gestão Oficina Mecânica
Tests all CRUD operations, sales flow, and reports
"""

import requests
import json
import sys
from datetime import datetime, date
from typing import Dict, Any, Optional

class OficinaAPITester:
    def __init__(self, base_url="https://garage-inventory.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_ids = {
            'customers': [],
            'parts': [],
            'services': [],
            'sales': []
        }

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED {details}")
        else:
            print(f"❌ {name} - FAILED {details}")

    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            else:
                return False, {}, 0

            return response.status_code < 400, response.json() if response.content else {}, response.status_code
            
        except requests.exceptions.RequestException as e:
            print(f"Request error: {str(e)}")
            return False, {}, 0
        except json.JSONDecodeError:
            return response.status_code < 400, {}, response.status_code

    def test_health_check(self):
        """Test health endpoint"""
        success, data, status = self.make_request('GET', 'health')
        expected_status = status == 200
        self.log_test("Health Check", success and expected_status, f"Status: {status}")
        return success and expected_status

    def test_customer_crud(self):
        """Test complete customer CRUD operations"""
        print("\n🔍 Testing Customer CRUD Operations...")
        
        # Test data
        customer_data = {
            "name": "João Silva",
            "phone": "(11) 99999-9999",
            "email": "joao@email.com",
            "address": "Rua das Flores, 123"
        }
        
        # CREATE
        success, data, status = self.make_request('POST', 'customers', customer_data)
        create_success = success and status == 200 and 'id' in data
        self.log_test("Create Customer", create_success, f"Status: {status}")
        
        if not create_success:
            return False
            
        customer_id = data['id']
        self.created_ids['customers'].append(customer_id)
        
        # READ (single)
        success, data, status = self.make_request('GET', f'customers/{customer_id}')
        read_success = success and status == 200 and data.get('name') == customer_data['name']
        self.log_test("Read Customer", read_success, f"Status: {status}")
        
        # READ (all)
        success, data, status = self.make_request('GET', 'customers')
        list_success = success and status == 200 and isinstance(data, list)
        self.log_test("List Customers", list_success, f"Status: {status}, Count: {len(data) if isinstance(data, list) else 0}")
        
        # UPDATE
        update_data = {"name": "João Silva Updated", "email": "joao.updated@email.com"}
        success, data, status = self.make_request('PUT', f'customers/{customer_id}', update_data)
        update_success = success and status == 200 and data.get('name') == update_data['name']
        self.log_test("Update Customer", update_success, f"Status: {status}")
        
        # DELETE (will be done in cleanup)
        return create_success and read_success and list_success and update_success

    def test_part_crud(self):
        """Test complete part CRUD operations"""
        print("\n🔍 Testing Part CRUD Operations...")
        
        # Test data
        part_data = {
            "name": "Filtro de Óleo",
            "description": "Filtro de óleo para motor",
            "reference_code": "FO001",
            "cost_price": 15.00,
            "sale_price": 25.00,
            "stock_quantity": 10
        }
        
        # CREATE
        success, data, status = self.make_request('POST', 'parts', part_data)
        create_success = success and status == 200 and 'id' in data
        self.log_test("Create Part", create_success, f"Status: {status}")
        
        if not create_success:
            return False
            
        part_id = data['id']
        self.created_ids['parts'].append(part_id)
        
        # READ (single)
        success, data, status = self.make_request('GET', f'parts/{part_id}')
        read_success = success and status == 200 and data.get('name') == part_data['name']
        self.log_test("Read Part", read_success, f"Status: {status}")
        
        # READ (all)
        success, data, status = self.make_request('GET', 'parts')
        list_success = success and status == 200 and isinstance(data, list)
        self.log_test("List Parts", list_success, f"Status: {status}, Count: {len(data) if isinstance(data, list) else 0}")
        
        # UPDATE
        update_data = {"name": "Filtro de Óleo Premium", "sale_price": 30.00}
        success, data, status = self.make_request('PUT', f'parts/{part_id}', update_data)
        update_success = success and status == 200 and data.get('name') == update_data['name']
        self.log_test("Update Part", update_success, f"Status: {status}")
        
        # Test low stock endpoint
        success, data, status = self.make_request('GET', 'parts/low-stock')
        low_stock_success = success and status == 200 and isinstance(data, list)
        self.log_test("Low Stock Parts", low_stock_success, f"Status: {status}")
        
        return create_success and read_success and list_success and update_success and low_stock_success

    def test_service_crud(self):
        """Test complete service CRUD operations"""
        print("\n🔍 Testing Service CRUD Operations...")
        
        # Test data
        service_data = {
            "name": "Troca de Óleo",
            "description": "Troca de óleo do motor",
            "price": 50.00
        }
        
        # CREATE
        success, data, status = self.make_request('POST', 'services', service_data)
        create_success = success and status == 200 and 'id' in data
        self.log_test("Create Service", create_success, f"Status: {status}")
        
        if not create_success:
            return False
            
        service_id = data['id']
        self.created_ids['services'].append(service_id)
        
        # READ (single)
        success, data, status = self.make_request('GET', f'services/{service_id}')
        read_success = success and status == 200 and data.get('name') == service_data['name']
        self.log_test("Read Service", read_success, f"Status: {status}")
        
        # READ (all)
        success, data, status = self.make_request('GET', 'services')
        list_success = success and status == 200 and isinstance(data, list)
        self.log_test("List Services", list_success, f"Status: {status}, Count: {len(data) if isinstance(data, list) else 0}")
        
        # UPDATE
        update_data = {"name": "Troca de Óleo Premium", "price": 75.00}
        success, data, status = self.make_request('PUT', f'services/{service_id}', update_data)
        update_success = success and status == 200 and data.get('name') == update_data['name']
        self.log_test("Update Service", update_success, f"Status: {status}")
        
        return create_success and read_success and list_success and update_success

    def test_sales_operations(self):
        """Test sales creation and automatic stock deduction"""
        print("\n🔍 Testing Sales Operations...")
        
        if not self.created_ids['customers'] or not self.created_ids['parts'] or not self.created_ids['services']:
            print("❌ Cannot test sales - missing required data (customers, parts, services)")
            return False
        
        # Get current stock before sale
        part_id = self.created_ids['parts'][0]
        success, part_data, status = self.make_request('GET', f'parts/{part_id}')
        if not success:
            self.log_test("Get Part Stock Before Sale", False, f"Status: {status}")
            return False
        
        initial_stock = part_data.get('stock_quantity', 0)
        
        # Create sale with part and service
        sale_data = {
            "customer_id": self.created_ids['customers'][0],
            "items": [
                {
                    "type": "part",
                    "id": self.created_ids['parts'][0],
                    "name": "Filtro de Óleo Premium",
                    "price": 30.00,
                    "quantity": 2,
                    "subtotal": 60.00
                },
                {
                    "type": "service",
                    "id": self.created_ids['services'][0],
                    "name": "Troca de Óleo Premium",
                    "price": 75.00,
                    "quantity": 1,
                    "subtotal": 75.00
                }
            ]
        }
        
        # CREATE SALE
        success, data, status = self.make_request('POST', 'sales', sale_data)
        create_success = success and status == 200 and 'id' in data
        sale_number_valid = 'sale_number' in data and len(data.get('sale_number', '')) == 11
        self.log_test("Create Sale", create_success and sale_number_valid, 
                     f"Status: {status}, Sale Number: {data.get('sale_number', 'N/A')}")
        
        if not create_success:
            return False
            
        sale_id = data['id']
        self.created_ids['sales'].append(sale_id)
        
        # Verify sale number format (YYYYMMDDXXX)
        sale_number = data.get('sale_number', '')
        today = datetime.now().strftime("%Y%m%d")
        number_format_valid = sale_number.startswith(today) and len(sale_number) == 11
        self.log_test("Sale Number Format", number_format_valid, f"Expected: {today}XXX, Got: {sale_number}")
        
        # Verify totals calculation
        expected_total = 60.00 + 75.00  # parts + services
        actual_total = data.get('total', 0)
        totals_valid = abs(actual_total - expected_total) < 0.01
        self.log_test("Sale Totals Calculation", totals_valid, f"Expected: {expected_total}, Got: {actual_total}")
        
        # Check stock deduction
        success, updated_part_data, status = self.make_request('GET', f'parts/{part_id}')
        if success:
            final_stock = updated_part_data.get('stock_quantity', 0)
            expected_stock = initial_stock - 2  # sold 2 units
            stock_deduction_valid = final_stock == expected_stock
            self.log_test("Stock Deduction", stock_deduction_valid, 
                         f"Initial: {initial_stock}, Final: {final_stock}, Expected: {expected_stock}")
        else:
            self.log_test("Stock Deduction Check", False, f"Could not retrieve updated part data")
            stock_deduction_valid = False
        
        # READ SALE
        success, data, status = self.make_request('GET', f'sales/{sale_id}')
        read_success = success and status == 200 and data.get('id') == sale_id
        self.log_test("Read Sale", read_success, f"Status: {status}")
        
        # LIST SALES
        success, data, status = self.make_request('GET', 'sales')
        list_success = success and status == 200 and isinstance(data, list)
        self.log_test("List Sales", list_success, f"Status: {status}, Count: {len(data) if isinstance(data, list) else 0}")
        
        return (create_success and sale_number_valid and number_format_valid and 
                totals_valid and stock_deduction_valid and read_success and list_success)

    def test_settings_operations(self):
        """Test settings get and update operations"""
        print("\n🔍 Testing Settings Operations...")
        
        # GET SETTINGS
        success, data, status = self.make_request('GET', 'settings')
        get_success = success and status == 200 and isinstance(data, dict)
        self.log_test("Get Settings", get_success, f"Status: {status}")
        
        if not get_success:
            return False
        
        # UPDATE SETTING
        new_threshold = 3
        success, data, status = self.make_request('PUT', 'settings/low_stock_threshold', {"value": new_threshold})
        update_success = success and status == 200
        self.log_test("Update Setting", update_success, f"Status: {status}")
        
        # VERIFY UPDATE
        success, data, status = self.make_request('GET', 'settings')
        if success and status == 200:
            verify_success = data.get('low_stock_threshold') == new_threshold
            self.log_test("Verify Setting Update", verify_success, 
                         f"Expected: {new_threshold}, Got: {data.get('low_stock_threshold')}")
        else:
            verify_success = False
            self.log_test("Verify Setting Update", False, f"Could not retrieve settings")
        
        return get_success and update_success and verify_success

    def test_reports(self):
        """Test reports functionality"""
        print("\n🔍 Testing Reports...")
        
        # Test sales report
        start_date = "2025-01-01"
        end_date = "2025-01-31"
        
        success, data, status = self.make_request('GET', f'reports/sales?start_date={start_date}&end_date={end_date}')
        report_success = success and status == 200 and isinstance(data, dict)
        
        if report_success:
            required_fields = ['period', 'total_sales', 'total_revenue', 'parts_revenue', 'services_revenue', 'sales']
            fields_present = all(field in data for field in required_fields)
            self.log_test("Sales Report", fields_present, 
                         f"Status: {status}, Total Sales: {data.get('total_sales', 0)}")
        else:
            self.log_test("Sales Report", False, f"Status: {status}")
        
        return report_success

    def cleanup_test_data(self):
        """Clean up created test data"""
        print("\n🧹 Cleaning up test data...")
        
        # Delete sales (no delete endpoint, so skip)
        
        # Delete customers
        for customer_id in self.created_ids['customers']:
            success, _, status = self.make_request('DELETE', f'customers/{customer_id}')
            self.log_test(f"Delete Customer {customer_id[:8]}...", success, f"Status: {status}")
        
        # Delete parts
        for part_id in self.created_ids['parts']:
            success, _, status = self.make_request('DELETE', f'parts/{part_id}')
            self.log_test(f"Delete Part {part_id[:8]}...", success, f"Status: {status}")
        
        # Delete services
        for service_id in self.created_ids['services']:
            success, _, status = self.make_request('DELETE', f'services/{service_id}')
            self.log_test(f"Delete Service {service_id[:8]}...", success, f"Status: {status}")

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Backend API Tests for Gestão Oficina Mecânica")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 60)
        
        try:
            # Basic connectivity
            if not self.test_health_check():
                print("❌ Health check failed - aborting tests")
                return False
            
            # CRUD operations
            customer_tests = self.test_customer_crud()
            part_tests = self.test_part_crud()
            service_tests = self.test_service_crud()
            
            # Sales operations (requires previous data)
            sales_tests = self.test_sales_operations()
            
            # Settings and reports
            settings_tests = self.test_settings_operations()
            reports_tests = self.test_reports()
            
            # Cleanup
            self.cleanup_test_data()
            
            # Summary
            print("\n" + "=" * 60)
            print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
            
            if self.tests_passed == self.tests_run:
                print("🎉 All tests passed! Backend is working correctly.")
                return True
            else:
                print(f"⚠️  {self.tests_run - self.tests_passed} tests failed.")
                return False
                
        except Exception as e:
            print(f"💥 Unexpected error during testing: {str(e)}")
            return False

def main():
    """Main test execution"""
    tester = OficinaAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())