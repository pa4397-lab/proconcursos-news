
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';

const AdminDashboard = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, byCategory: [] });
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    source: '',
    url: '',
    summary: '',
    analysis: '',
    probability: 50,
    category: ''
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const result = await pb.collection('news').getList(1, 100, {
        sort: '-created_at',
        $autoCancel: false
      });
      setNews(result.items);
      calculateStats(result.items);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as notícias.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (newsItems) => {
    const categoryCount = {};
    newsItems.forEach((item) => {
      if (item.category) {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
      }
    });

    const byCategory = Object.entries(categoryCount).map(([name, count]) => ({
      name,
      count
    }));

    setStats({
      total: newsItems.length,
      byCategory
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await pb.collection('news').update(editingNews.id, formData, { $autoCancel: false });
        toast({
          title: 'Sucesso',
          description: 'Notícia atualizada com sucesso!'
        });
      } else {
        await pb.collection('news').create(formData, { $autoCancel: false });
        toast({
          title: 'Sucesso',
          description: 'Notícia criada com sucesso!'
        });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchNews();
    } catch (error) {
      console.error('Error saving news:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a notícia.',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (item) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      source: item.source,
      url: item.url,
      summary: item.summary || '',
      analysis: item.analysis || '',
      probability: item.probability || 50,
      category: item.category || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta notícia?')) {
      try {
        await pb.collection('news').delete(id, { $autoCancel: false });
        toast({
          title: 'Sucesso',
          description: 'Notícia excluída com sucesso!'
        });
        fetchNews();
      } catch (error) {
        console.error('Error deleting news:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir a notícia.',
          variant: 'destructive'
        });
      }
    }
  };

  const resetForm = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      source: '',
      url: '',
      summary: '',
      analysis: '',
      probability: 50,
      category: ''
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - PROCONCURSOS NEWS</title>
        <meta name="description" content="Painel administrativo do PROCONCURSOS NEWS" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: 'Merriweather, serif' }}>
              Dashboard Administrativo
            </h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Notícia
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingNews ? 'Editar Notícia' : 'Nova Notícia'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="bg-white text-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="source">Fonte *</Label>
                      <Input
                        id="source"
                        value={formData.source}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                        required
                        className="bg-white text-gray-900"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Ex: INSS, Polícia Federal"
                        className="bg-white text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">URL Original *</Label>
                    <Input
                      id="url"
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      required
                      className="bg-white text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">Resumo IA</Label>
                    <Textarea
                      id="summary"
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      rows={4}
                      className="bg-white text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="analysis">Análise IA</Label>
                    <Textarea
                      id="analysis"
                      value={formData.analysis}
                      onChange={(e) => setFormData({ ...formData, analysis: e.target.value })}
                      rows={4}
                      className="bg-white text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="probability">Probabilidade de Edital (%)</Label>
                    <Input
                      id="probability"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.probability}
                      onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) })}
                      className="bg-white text-gray-900"
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingNews ? 'Atualizar' : 'Criar'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">
                  {stats.total}
                </div>
                <p className="text-sm text-muted-foreground">Total de Notícias</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.byCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stats.byCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma categoria cadastrada
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Notícias</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Carregando...</p>
                </div>
              ) : news.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma notícia cadastrada.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Fonte</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Probabilidade</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {news.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium max-w-xs truncate">
                            {item.title}
                          </TableCell>
                          <TableCell>{item.source}</TableCell>
                          <TableCell>
                            {item.category && (
                              <Badge variant="secondary">{item.category}</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {item.probability !== null && item.probability !== undefined ? (
                              <span className="font-medium">{item.probability}%</span>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(item.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(item)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default AdminDashboard;
