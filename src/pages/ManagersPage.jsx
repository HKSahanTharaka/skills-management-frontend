import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, CheckCircle, XCircle, Trash2, Clock, Users, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { managerService } from '../services/manager.service';
import { format } from 'date-fns';
import RoleBadge from '../components/common/RoleBadge';

const ManagersPage = () => {
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showApproveConfirm, setShowApproveConfirm] = useState(null);
  const [showRejectConfirm, setShowRejectConfirm] = useState(null);
  const [filters, setFilters] = useState({
    approval_status: '',
    search: '',
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['managers', filters],
    queryFn: () => managerService.getAll(filters),
  });

  const { data: stats } = useQuery({
    queryKey: ['manager-stats'],
    queryFn: () => managerService.getStats(),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => managerService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managers'] });
      queryClient.invalidateQueries({ queryKey: ['manager-stats'] });
      toast.success('Manager approved successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || 'Failed to approve manager');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => managerService.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managers'] });
      queryClient.invalidateQueries({ queryKey: ['manager-stats'] });
      toast.success('Manager rejected successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || 'Failed to reject manager');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => managerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managers'] });
      queryClient.invalidateQueries({ queryKey: ['manager-stats'] });
      toast.success('Manager deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || 'Failed to delete manager');
    },
  });

  const handleApprove = () => {
    if (!showApproveConfirm) return;
    approveMutation.mutate(showApproveConfirm.id);
    setShowApproveConfirm(null);
  };

  const handleReject = () => {
    if (!showRejectConfirm) return;
    rejectMutation.mutate(showRejectConfirm.id);
    setShowRejectConfirm(null);
  };

  const handleDelete = () => {
    if (!showDeleteConfirm) return;
    deleteMutation.mutate(showDeleteConfirm.id);
    setShowDeleteConfirm(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const columns = [
    {
      key: 'email',
      label: 'Email',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-slate-100">{row.email}</div>
          {row.personnel && (
            <div className="text-sm text-gray-500 dark:text-slate-400">{row.personnel.name}</div>
          )}
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (value, row) => <RoleBadge role={row.role} />,
    },
    {
      key: 'approval_status',
      label: 'Status',
      render: (value, row) => getStatusBadge(row.approval_status),
    },
    {
      key: 'created_at',
      label: 'Registered',
      render: (value, row) => (
        <div className="text-sm text-gray-600 dark:text-slate-400">
          {format(new Date(row.created_at), 'MMM dd, yyyy')}
        </div>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {row.approval_status === 'pending' && (
            <>
              <Button
                size="sm"
                variant="success"
                onClick={() => setShowApproveConfirm(row)}
                icon={CheckCircle}
                disabled={approveMutation.isPending}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => setShowRejectConfirm(row)}
                icon={XCircle}
                disabled={rejectMutation.isPending}
              >
                Reject
              </Button>
            </>
          )}
          {row.approval_status === 'approved' && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => setShowRejectConfirm(row)}
              icon={XCircle}
              disabled={rejectMutation.isPending}
            >
              Revoke
            </Button>
          )}
          {row.approval_status === 'rejected' && (
            <Button
              size="sm"
              variant="success"
              onClick={() => setShowApproveConfirm(row)}
              icon={CheckCircle}
              disabled={approveMutation.isPending}
            >
              Approve
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowDeleteConfirm(row)}
            icon={Trash2}
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
          Manager Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-slate-400">
          Approve, reject, or manage manager accounts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">Total Managers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {stats?.data?.total || 0}
              </p>
            </div>
            <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats?.data?.pending || 0}
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">Approved</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats?.data?.approved || 0}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats?.data?.rejected || 0}
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by email or name..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                icon={Search}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={filters.approval_status}
                onChange={(e) => handleFilterChange('approval_status', e.target.value)}
                icon={Filter}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Select>
            </div>
          </div>

          {data?.data?.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No managers found"
              description="No managers match your current filters"
            />
          ) : (
            <>
              <Table columns={columns} data={data?.data || []} />
              
              {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={data.pagination.page}
                    totalPages={data.pagination.totalPages}
                    totalItems={data.pagination.total}
                    itemsPerPage={data.pagination.limit}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Confirm Delete"
        size="sm"
        footer={
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-gray-600 dark:text-slate-400">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900 dark:text-slate-100">{showDeleteConfirm?.email}</span>? This action cannot be
          undone.
        </p>
      </Modal>

      <Modal
        isOpen={!!showApproveConfirm}
        onClose={() => setShowApproveConfirm(null)}
        title="Confirm Approval"
        size="sm"
        footer={
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => setShowApproveConfirm(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleApprove}
              isLoading={approveMutation.isPending}
              className="flex-1"
            >
              Approve
            </Button>
          </div>
        }
      >
        <p className="text-gray-600 dark:text-slate-400">
          Are you sure you want to approve{' '}
          <span className="font-semibold text-gray-900 dark:text-slate-100">{showApproveConfirm?.email}</span> as a manager?
        </p>
      </Modal>

      <Modal
        isOpen={!!showRejectConfirm}
        onClose={() => setShowRejectConfirm(null)}
        title={showRejectConfirm?.approval_status === 'approved' ? 'Confirm Revoke' : 'Confirm Rejection'}
        size="sm"
        footer={
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => setShowRejectConfirm(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              isLoading={rejectMutation.isPending}
              className="flex-1"
            >
              {showRejectConfirm?.approval_status === 'approved' ? 'Revoke' : 'Reject'}
            </Button>
          </div>
        }
      >
        <p className="text-gray-600 dark:text-slate-400">
          Are you sure you want to {showRejectConfirm?.approval_status === 'approved' ? 'revoke' : 'reject'}{' '}
          <span className="font-semibold text-gray-900 dark:text-slate-100">{showRejectConfirm?.email}</span>
          {showRejectConfirm?.approval_status === 'approved' ? "'s manager access" : ''}?
        </p>
      </Modal>
    </div>
  );
};

export default ManagersPage;

