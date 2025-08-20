import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { 
  ShoppingCart, 
  Users, 
  Package, 
  Wrench,
  BarChart3,
  Settings,
  Home,
  Plus,
  Edit,
  Trash2,
  Search,
  Calendar,
  Printer,
  AlertTriangle
} from 'lucide-react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// API functions
const api = {
  // Customers
  getCustomers: () => axios.get(`${API_BASE_URL}/api/customers`),
  createCustomer: (data) => axios.post(`${API_BASE_URL}/api/customers`, data),
  updateCustomer: (id, data) => axios.put(`${API_BASE_URL}/api/customers/${id}`, data),
  deleteCustomer: (id) => axios.delete(`${API_BASE_URL}/api/customers/${id}`),
  
  // Parts
  getParts: () => axios.get(`${API_BASE_URL}/api/parts`),
  createPart: (data) => axios.post(`${API_BASE_URL}/api/parts`, data),
  updatePart: (id, data) => axios.put(`${API_BASE_URL}/api/parts/${id}`, data),
  deletePart: (id) => axios.delete(`${API_BASE_URL}/api/parts/${id}`),
  getLowStockParts: () => axios.get(`${API_BASE_URL}/api/parts/low-stock`),
  
  // Services
  getServices: () => axios.get(`${API_BASE_URL}/api/services`),
  createService: (data) => axios.post(`${API_BASE_URL}/api/services`, data),
  updateService: (id, data) => axios.put(`${API_BASE_URL}/api/services/${id}`, data),
  deleteService: (id) => axios.delete(`${API_BASE_URL}/api/services/${id}`),
  
  // Sales
  getSales: () => axios.get(`${API_BASE_URL}/api/sales`),
  createSale: (data) => axios.post(`${API_BASE_URL}/api/sales`, data),
  getSale: (id) => axios.get(`${API_BASE_URL}/api/sales/${id}`),
  
  // Settings
  getSettings: () => axios.get(`${API_BASE_URL}/api/settings`),
  updateSetting: (key, value) => axios.put(`${API_BASE_URL}/api/settings/${key}`, { value }),
  
  // Reports
  getSalesReport: (startDate, endDate) => 
    axios.get(`${API_BASE_URL}/api/reports/sales?start_date=${startDate}&end_date=${endDate}`)
};

// Navigation Component
const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/sales', label: 'Vendas', icon: ShoppingCart },
    { path: '/customers', label: 'Clientes', icon: Users },
    { path: '/parts', label: 'Peças', icon: Package },
    { path: '/services', label: 'Serviços', icon: Wrench },
    { path: '/reports', label: 'Relatórios', icon: BarChart3 },
    { path: '/settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <nav className="bg-white border-r border-gray-200 w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-800">Gestão Oficina</h1>
        <p className="text-sm text-gray-600">Sistema de Vendas e Estoque</p>
      </div>
      
      <ul className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalCustomers: 0,
    totalParts: 0,
    lowStockParts: 0
  });
  const [recentSales, setRecentSales] = useState([]);
  const [lowStockParts, setLowStockParts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [salesRes, customersRes, partsRes, lowStockRes] = await Promise.all([
          api.getSales(),
          api.getCustomers(),
          api.getParts(),
          api.getLowStockParts()
        ]);

        setStats({
          totalSales: salesRes.data.length,
          totalCustomers: customersRes.data.length,
          totalParts: partsRes.data.length,
          lowStockParts: lowStockRes.data.length
        });

        setRecentSales(salesRes.data.slice(0, 5));
        setLowStockParts(lowStockRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral da sua oficina mecânica</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total de Vendas</p>
                <p className="text-3xl font-bold">{stats.totalSales}</p>
              </div>
              <ShoppingCart className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Clientes</p>
                <p className="text-3xl font-bold">{stats.totalCustomers}</p>
              </div>
              <Users className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Peças Cadastradas</p>
                <p className="text-3xl font-bold">{stats.totalParts}</p>
              </div>
              <Package className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Estoque Baixo</p>
                <p className="text-3xl font-bold">{stats.lowStockParts}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales and Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentSales.length > 0 ? (
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">#{sale.sale_number}</p>
                      <p className="text-sm text-gray-600">
                        {sale.customer_data?.name || 'Cliente não informado'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">R$ {sale.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{sale.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhuma venda registrada</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockParts.length > 0 ? (
              <div className="space-y-3">
                {lowStockParts.map((part) => (
                  <div key={part.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-semibold">{part.name}</p>
                      <p className="text-sm text-gray-600">Código: {part.reference_code}</p>
                    </div>
                    <Badge variant="destructive" className="font-bold">
                      {part.stock_quantity} unidades
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhuma peça com estoque baixo</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Sales Components
const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [showNewSaleDialog, setShowNewSaleDialog] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await api.getSales();
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const handleSaleCreated = () => {
    setShowNewSaleDialog(false);
    fetchSales();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
          <p className="text-gray-600 mt-2">Gerencie suas vendas e emita recibos</p>
        </div>
        <Dialog open={showNewSaleDialog} onOpenChange={setShowNewSaleDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Venda
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Venda</DialogTitle>
            </DialogHeader>
            <NewSaleForm onSaleCreated={handleSaleCreated} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-mono">{sale.sale_number}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.customer_data?.name || 'Não informado'}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    R$ {sale.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => printReceipt(sale)}
                      className="mr-2"
                    >
                      <Printer className="w-4 h-4 mr-1" />
                      Imprimir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// Print receipt function
const printReceipt = (sale) => {
  const printWindow = window.open('', '_blank');
  const receiptHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Recibo - ${sale.sale_number}</title>
      <style>
        body { font-family: 'Courier New', monospace; font-size: 12px; margin: 0; padding: 20px; max-width: 300px; }
        .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
        .item { display: flex; justify-content: space-between; margin-bottom: 2px; }
        .total { border-top: 1px dashed #000; padding-top: 5px; font-weight: bold; }
        .footer { text-align: center; margin-top: 10px; font-size: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h3>OFICINA MECÂNICA</h3>
        <p>RECIBO NÃO FISCAL</p>
        <p>Número: ${sale.sale_number}</p>
        <p>Data: ${sale.date}</p>
        <p>Cliente: ${sale.customer_data?.name || 'Não informado'}</p>
      </div>
      
      <div class="items">
        ${sale.items.map(item => `
          <div class="item">
            <span>${item.name} (${item.quantity}x)</span>
            <span>R$ ${item.subtotal.toFixed(2)}</span>
          </div>
        `).join('')}
      </div>
      
      <div class="total">
        <div class="item">
          <span>Subtotal Peças:</span>
          <span>R$ ${sale.subtotal_parts.toFixed(2)}</span>
        </div>
        <div class="item">
          <span>Subtotal Serviços:</span>
          <span>R$ ${sale.subtotal_services.toFixed(2)}</span>
        </div>
        <div class="item">
          <span>TOTAL:</span>
          <span>R$ ${sale.total.toFixed(2)}</span>
        </div>
      </div>
      
      <div class="footer">
        <p>*** RECIBO NÃO FISCAL ***</p>
        <p>Obrigado pela preferência!</p>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(receiptHtml);
  printWindow.document.close();
  printWindow.print();
};

const NewSaleForm = ({ onSaleCreated }) => {
  const [customers, setCustomers] = useState([]);
  const [parts, setParts] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [saleItems, setSaleItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const [customersRes, partsRes, servicesRes] = await Promise.all([
        api.getCustomers(),
        api.getParts(),
        api.getServices()
      ]);
      
      setCustomers(customersRes.data);
      setParts(partsRes.data);
      setServices(servicesRes.data);
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  const addItemToSale = (item, type) => {
    const existingIndex = saleItems.findIndex(saleItem => saleItem.id === item.id && saleItem.type === type);
    
    if (existingIndex >= 0) {
      const updatedItems = [...saleItems];
      updatedItems[existingIndex].quantity += 1;
      updatedItems[existingIndex].subtotal = updatedItems[existingIndex].quantity * updatedItems[existingIndex].price;
      setSaleItems(updatedItems);
    } else {
      const newItem = {
        type,
        id: item.id,
        name: item.name,
        price: type === 'part' ? item.sale_price : item.price,
        quantity: 1,
        subtotal: type === 'part' ? item.sale_price : item.price
      };
      setSaleItems([...saleItems, newItem]);
    }
  };

  const removeItemFromSale = (index) => {
    const updatedItems = saleItems.filter((_, i) => i !== index);
    setSaleItems(updatedItems);
  };

  const updateItemQuantity = (index, quantity) => {
    if (quantity <= 0) return;
    
    const updatedItems = [...saleItems];
    updatedItems[index].quantity = quantity;
    updatedItems[index].subtotal = quantity * updatedItems[index].price;
    setSaleItems(updatedItems);
  };

  const calculateTotals = () => {
    const subtotalParts = saleItems
      .filter(item => item.type === 'part')
      .reduce((sum, item) => sum + item.subtotal, 0);
    
    const subtotalServices = saleItems
      .filter(item => item.type === 'service')
      .reduce((sum, item) => sum + item.subtotal, 0);
    
    return {
      subtotalParts,
      subtotalServices,
      total: subtotalParts + subtotalServices
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (saleItems.length === 0) {
      alert('Adicione pelo menos um item à venda');
      return;
    }

    try {
      const saleData = {
        customer_id: selectedCustomer === "none" ? null : selectedCustomer || null,
        items: saleItems
      };
      
      await api.createSale(saleData);
      onSaleCreated();
    } catch (error) {
      console.error('Error creating sale:', error);
      alert('Erro ao criar venda');
    }
  };

  const totals = calculateTotals();
  const filteredParts = parts.filter(part => 
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.reference_code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Selection */}
      <div>
        <Label htmlFor="customer">Cliente (Opcional)</Label>
        <Select value={selectedCustomer || undefined} onValueChange={setSelectedCustomer}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhum cliente</SelectItem>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name} - {customer.phone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search */}
      <div>
        <Label htmlFor="search">Buscar Peças/Serviços</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            placeholder="Digite o nome da peça ou serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="parts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="parts">Peças</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parts" className="space-y-4">
          <div className="max-h-60 overflow-y-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParts.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell>{part.name}</TableCell>
                    <TableCell className="font-mono text-sm">{part.reference_code}</TableCell>
                    <TableCell>R$ {part.sale_price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={part.stock_quantity <= 5 ? "destructive" : "secondary"}>
                        {part.stock_quantity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addItemToSale(part, 'part')}
                        disabled={part.stock_quantity <= 0}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="services" className="space-y-4">
          <div className="max-h-60 overflow-y-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell className="text-sm text-gray-600">{service.description}</TableCell>
                    <TableCell>R$ {service.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addItemToSale(service, 'service')}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sale Items */}
      {saleItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Itens da Venda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {saleItems.map((item, index) => (
                <div key={`${item.type}-${item.id}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.type === 'part' ? 'Peça' : 'Serviço'} - R$ {item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateItemQuantity(index, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateItemQuantity(index, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <p className="font-bold min-w-20 text-right">R$ {item.subtotal.toFixed(2)}</p>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItemFromSale(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal Peças:</span>
                <span>R$ {totals.subtotalParts.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal Serviços:</span>
                <span>R$ {totals.subtotalServices.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>R$ {totals.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
          Finalizar Venda
        </Button>
      </div>
    </form>
  );
};

// Customer Components
const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.getCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowDialog(true);
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await api.deleteCustomer(customerId);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Erro ao excluir cliente');
      }
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingCustomer(null);
    fetchCustomers();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-2">Gerencie seus clientes cadastrados</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCustomer ? 'Editar Cliente' : 'Novo Cliente'}
              </DialogTitle>
            </DialogHeader>
            <CustomerForm customer={editingCustomer} onClose={handleDialogClose} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-semibold">{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.email || '-'}</TableCell>
                  <TableCell className="max-w-32 truncate">{customer.address || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(customer)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(customer.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const CustomerForm = ({ customer, onClose }) => {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    address: customer?.address || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (customer) {
        await api.updateCustomer(customer.id, formData);
      } else {
        await api.createCustomer(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Erro ao salvar cliente');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Telefone *</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <Label htmlFor="address">Endereço</Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="flex gap-3">
        <Button type="submit" className="flex-1">
          {customer ? 'Atualizar' : 'Criar'} Cliente
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

// Parts Page (similar structure for services)
const PartsPage = () => {
  const [parts, setParts] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPart, setEditingPart] = useState(null);

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      const response = await api.getParts();
      setParts(response.data);
    } catch (error) {
      console.error('Error fetching parts:', error);
    }
  };

  const handleEdit = (part) => {
    setEditingPart(part);
    setShowDialog(true);
  };

  const handleDelete = async (partId) => {
    if (window.confirm('Tem certeza que deseja excluir esta peça?')) {
      try {
        await api.deletePart(partId);
        fetchParts();
      } catch (error) {
        console.error('Error deleting part:', error);
        alert('Erro ao excluir peça');
      }
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingPart(null);
    fetchParts();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Peças</h1>
          <p className="text-gray-600 mt-2">Gerencie o estoque de peças</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Peça
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPart ? 'Editar Peça' : 'Nova Peça'}
              </DialogTitle>
            </DialogHeader>
            <PartForm part={editingPart} onClose={handleDialogClose} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Preço Custo</TableHead>
                <TableHead>Preço Venda</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parts.map((part) => (
                <TableRow key={part.id}>
                  <TableCell className="font-semibold">{part.name}</TableCell>
                  <TableCell className="font-mono text-sm">{part.reference_code}</TableCell>
                  <TableCell>R$ {part.cost_price.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold">R$ {part.sale_price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={part.stock_quantity <= 5 ? "destructive" : "secondary"}>
                      {part.stock_quantity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(part)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(part.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const PartForm = ({ part, onClose }) => {
  const [formData, setFormData] = useState({
    name: part?.name || '',
    description: part?.description || '',
    reference_code: part?.reference_code || '',
    cost_price: part?.cost_price || '',
    sale_price: part?.sale_price || '',
    stock_quantity: part?.stock_quantity || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        cost_price: parseFloat(formData.cost_price),
        sale_price: parseFloat(formData.sale_price),
        stock_quantity: parseInt(formData.stock_quantity)
      };

      if (part) {
        await api.updatePart(part.id, data);
      } else {
        await api.createPart(data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving part:', error);
      alert('Erro ao salvar peça');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="reference_code">Código de Referência *</Label>
        <Input
          id="reference_code"
          name="reference_code"
          value={formData.reference_code}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cost_price">Preço de Custo *</Label>
          <Input
            id="cost_price"
            name="cost_price"
            type="number"
            step="0.01"
            min="0"
            value={formData.cost_price}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="sale_price">Preço de Venda *</Label>
          <Input
            id="sale_price"
            name="sale_price"
            type="number"
            step="0.01"
            min="0"
            value={formData.sale_price}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="stock_quantity">Quantidade em Estoque *</Label>
        <Input
          id="stock_quantity"
          name="stock_quantity"
          type="number"
          min="0"
          value={formData.stock_quantity}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="flex gap-3">
        <Button type="submit" className="flex-1">
          {part ? 'Atualizar' : 'Criar'} Peça
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

// Services Page
const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.getServices();
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowDialog(true);
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await api.deleteService(serviceId);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Erro ao excluir serviço');
      }
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingService(null);
    fetchServices();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-600 mt-2">Gerencie os serviços oferecidos</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Editar Serviço' : 'Novo Serviço'}
              </DialogTitle>
            </DialogHeader>
            <ServiceForm service={editingService} onClose={handleDialogClose} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-semibold">{service.name}</TableCell>
                  <TableCell className="max-w-64 truncate">{service.description || '-'}</TableCell>
                  <TableCell className="font-semibold text-green-600">R$ {service.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const ServiceForm = ({ service, onClose }) => {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    price: service?.price || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (service) {
        await api.updateService(service.id, data);
      } else {
        await api.createService(data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Erro ao salvar serviço');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="price">Preço *</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="flex gap-3">
        <Button type="submit" className="flex-1">
          {service ? 'Atualizar' : 'Criar'} Serviço
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

// Reports Page
const ReportsPage = () => {
  const [reportType, setReportType] = useState('sales');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salesReport, setSalesReport] = useState(null);
  const [lowStockParts, setLowStockParts] = useState([]);

  useEffect(() => {
    // Set default dates (last 30 days)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
    
    fetchLowStockParts();
  }, []);

  const fetchSalesReport = async () => {
    if (!startDate || !endDate) return;
    
    try {
      const response = await api.getSalesReport(startDate, endDate);
      setSalesReport(response.data);
    } catch (error) {
      console.error('Error fetching sales report:', error);
    }
  };

  const fetchLowStockParts = async () => {
    try {
      const response = await api.getLowStockParts();
      setLowStockParts(response.data);
    } catch (error) {
      console.error('Error fetching low stock parts:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600 mt-2">Analise o desempenho da sua oficina</p>
      </div>

      <Tabs value={reportType} onValueChange={setReportType}>
        <TabsList>
          <TabsTrigger value="sales">Vendas por Período</TabsTrigger>
          <TabsTrigger value="stock">Estoque Baixo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Vendas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="start-date">Data Inicial</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">Data Final</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={fetchSalesReport} className="w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </div>
              </div>

              {salesReport && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-blue-50">
                      <CardContent className="p-4">
                        <p className="text-blue-600 font-semibold">Total de Vendas</p>
                        <p className="text-2xl font-bold text-blue-800">{salesReport.total_sales}</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-green-50">
                      <CardContent className="p-4">
                        <p className="text-green-600 font-semibold">Receita Total</p>
                        <p className="text-2xl font-bold text-green-800">R$ {salesReport.total_revenue.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-purple-50">
                      <CardContent className="p-4">
                        <p className="text-purple-600 font-semibold">Receita Peças</p>
                        <p className="text-2xl font-bold text-purple-800">R$ {salesReport.parts_revenue.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-orange-50">
                      <CardContent className="p-4">
                        <p className="text-orange-600 font-semibold">Receita Serviços</p>
                        <p className="text-2xl font-bold text-orange-800">R$ {salesReport.services_revenue.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Detalhes das Vendas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Número</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {salesReport.sales.map((sale) => (
                            <TableRow key={sale.id}>
                              <TableCell className="font-mono">{sale.sale_number}</TableCell>
                              <TableCell>{sale.date}</TableCell>
                              <TableCell>{sale.customer_data?.name || 'Não informado'}</TableCell>
                              <TableCell className="font-semibold text-green-600">
                                R$ {sale.total.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stock" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Peças com Estoque Baixo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockParts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Estoque Atual</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockParts.map((part) => (
                      <TableRow key={part.id}>
                        <TableCell className="font-semibold">{part.name}</TableCell>
                        <TableCell className="font-mono text-sm">{part.reference_code}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">
                            {part.stock_quantity} unidades
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-red-600 border-red-600">
                            Estoque Baixo
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Nenhuma peça com estoque baixo encontrada
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Settings Page
const SettingsPage = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.getSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      await api.updateSetting(key, value);
      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Error updating setting:', error);
      alert('Erro ao atualizar configuração');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Update all settings
    Promise.all([
      updateSetting('workshop_name', formData.get('workshop_name')),
      updateSetting('workshop_address', formData.get('workshop_address')),
      updateSetting('workshop_phone', formData.get('workshop_phone')),
      updateSetting('low_stock_threshold', parseInt(formData.get('low_stock_threshold')))
    ]).then(() => {
      alert('Configurações salvas com sucesso!');
    });
  };

  if (loading) return <div>Carregando configurações...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-2">Configure os parâmetros do sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações da Oficina</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="workshop_name">Nome da Oficina</Label>
              <Input
                id="workshop_name"
                name="workshop_name"
                defaultValue={settings.workshop_name}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="workshop_address">Endereço</Label>
              <Textarea
                id="workshop_address"
                name="workshop_address"
                defaultValue={settings.workshop_address}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="workshop_phone">Telefone</Label>
              <Input
                id="workshop_phone"
                name="workshop_phone"
                defaultValue={settings.workshop_phone}
              />
            </div>
            
            <div>
              <Label htmlFor="low_stock_threshold">Limite de Estoque Baixo</Label>
              <Input
                id="low_stock_threshold"
                name="low_stock_threshold"
                type="number"
                min="1"
                defaultValue={settings.low_stock_threshold}
                required
              />
              <p className="text-sm text-gray-600 mt-1">
                Peças com quantidade menor ou igual a este valor serão consideradas com estoque baixo
              </p>
            </div>
            
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Salvar Configurações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Navigation />
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/parts" element={<PartsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;