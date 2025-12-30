import { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Info, TrendingUp, Calendar } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import Input from '../common/Input';
import { formatDisplayDate } from '../../utils/helpers';
import { usePermissions } from '../../hooks/usePermissions';

const AvailabilityCalendar = ({ personnelId, availabilityData, onAddPeriod, onEditPeriod, onDeletePeriod }) => {
  const { canDeleteAvailability } = usePermissions();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    availabilityPercentage: 100,
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAvailabilityForDate = (date) => {
    if (!availabilityData) return null;

    return availabilityData.find((period) => {
      const start = new Date(period.start_date);
      const end = new Date(period.end_date);
      return date >= start && date <= end;
    });
  };

  const getAvailabilityColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleAddClick = () => {
    setFormData({
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      availabilityPercentage: 100,
    });
    setShowAddModal(true);
  };

  const handleEditClick = (period) => {
    setSelectedPeriod(period);
    setFormData({
      startDate: format(new Date(period.start_date), 'yyyy-MM-dd'),
      endDate: format(new Date(period.end_date), 'yyyy-MM-dd'),
      availabilityPercentage: period.availability_percentage,
    });
    setShowEditModal(true);
  };

  const handleSubmitAdd = () => {
    onAddPeriod({
      personnelId,
      ...formData,
    });
    setShowAddModal(false);
  };

  const handleSubmitEdit = () => {
    onEditPeriod({
      id: selectedPeriod.id,
      ...formData,
    });
    setShowEditModal(false);
  };

  const handleDeleteClick = (period) => {
    setShowDeleteConfirm(period);
  };

  const handleDeleteConfirm = () => {
    if (showDeleteConfirm) {
      onDeletePeriod(showDeleteConfirm.id);
      setShowDeleteConfirm(null);
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calculateStats = () => {
    if (!availabilityData || availabilityData.length === 0) {
      return { avgAvailability: 100, minAvailability: 100, maxAvailability: 100, periodsCount: 0 };
    }

    const percentages = availabilityData.map(p => p.availability_percentage);
    const sum = percentages.reduce((a, b) => a + b, 0);
    
    return {
      avgAvailability: Math.round(sum / percentages.length),
      minAvailability: Math.min(...percentages),
      maxAvailability: Math.max(...percentages),
      periodsCount: availabilityData.length
    };
  };

  const stats = calculateStats();

  return (
    <Card>
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                About Availability Management
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Set availability periods to indicate when personnel can be allocated to projects. 
                100% means fully available, while lower percentages indicate partial availability (e.g., part-time work, other commitments).
              </p>
            </div>
          </div>
        </div>

        {availabilityData && availabilityData.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Avg. Availability</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.avgAvailability}%</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">Total Periods</span>
              </div>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.periodsCount}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Minimum</span>
              </div>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.minAvailability}%</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-orange-700 dark:text-orange-300">Maximum</span>
              </div>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.maxAvailability}%</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handlePrevMonth} size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <Button variant="ghost" onClick={handleNextMonth} size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="primary" onClick={handleAddClick} leftIcon={<Plus className="h-4 w-4" />}>
            Add Period
          </Button>
        </div>

        <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-50 dark:bg-slate-800">
            {weekDays.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-700 dark:text-slate-300 border-r border-gray-200 dark:border-slate-700 last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {Array.from({ length: monthStart.getDay() }).map((_, index) => (
              <div key={`empty-${index}`} className="p-2 border-r border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800" />
            ))}

            {daysInMonth.map((day) => {
              const availability = getAvailabilityForDate(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  className={`p-2 border-r border-b border-gray-200 dark:border-slate-700 min-h-20 bg-white dark:bg-slate-900 ${!isSameMonth(day, currentDate) ? 'bg-gray-50 dark:bg-slate-800' : ''
                    } ${isToday ? 'bg-primary-50 dark:bg-primary-900/30' : ''}`}
                >
                  <div className="flex flex-col h-full">
                    <span className={`text-sm ${isToday ? 'font-bold text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-slate-300'}`}>
                      {format(day, 'd')}
                    </span>
                    {availability && (
                      <div className="mt-1 flex-1 flex flex-col justify-center">
                        <div className={`text-xs text-center py-1 px-1 rounded text-white ${getAvailabilityColor(availability.availability_percentage)}`}>
                          {availability.availability_percentage}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-slate-100 mb-3">Availability Periods</h4>
          {availabilityData && availabilityData.length > 0 ? (
            <div className="space-y-2">
              {availabilityData.map((period) => (
                <div
                  key={period.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-4 w-4 text-gray-400 dark:text-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                        {formatDisplayDate(period.start_date)} - {formatDisplayDate(period.end_date)}
                      </p>
                    </div>
                    <Badge variant={period.availability_percentage >= 80 ? 'green' : period.availability_percentage >= 50 ? 'yellow' : 'red'}>
                      {period.availability_percentage}%
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(period)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {canDeleteAvailability && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(period)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-slate-400 text-center py-4">No availability periods defined</p>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600 dark:text-slate-400">Legend:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-gray-700 dark:text-slate-300">80-100%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded" />
            <span className="text-gray-700 dark:text-slate-300">50-79%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded" />
            <span className="text-gray-700 dark:text-slate-300">20-49%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <span className="text-gray-700 dark:text-slate-300">0-19%</span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Availability Period"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmitAdd} className="flex-1">
              Add Period
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-700 dark:text-slate-300">
              <strong>Tip:</strong> Set the date range and availability percentage. 
              For example, 50% means the person is available half-time during this period.
            </p>
          </div>
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            helperText="When does this availability period begin?"
          />
          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            helperText="When does this availability period end?"
          />
          <div>
            <Input
              label="Availability Percentage"
              type="number"
              min="0"
              max="100"
              value={formData.availabilityPercentage}
              onChange={(e) => setFormData({ ...formData, availabilityPercentage: Number(e.target.value) })}
              helperText="How much capacity is available? (0-100%)"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-gray-600 dark:text-slate-400">
              <span>0% (Unavailable)</span>
              <span>50% (Half-time)</span>
              <span>100% (Fully available)</span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 transition-all duration-300"
                style={{ width: `${formData.availabilityPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Availability Period"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmitEdit} className="flex-1">
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            helperText="When does this availability period begin?"
          />
          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            helperText="When does this availability period end?"
          />
          <div>
            <Input
              label="Availability Percentage"
              type="number"
              min="0"
              max="100"
              value={formData.availabilityPercentage}
              onChange={(e) => setFormData({ ...formData, availabilityPercentage: Number(e.target.value) })}
              helperText="How much capacity is available? (0-100%)"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-gray-600 dark:text-slate-400">
              <span>0% (Unavailable)</span>
              <span>50% (Half-time)</span>
              <span>100% (Fully available)</span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 transition-all duration-300"
                style={{ width: `${formData.availabilityPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </Modal>

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
              onClick={handleDeleteConfirm}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-gray-600 dark:text-slate-400">
          Are you sure you want to delete the availability period{' '}
          <span className="font-semibold text-gray-900 dark:text-slate-100">
            {showDeleteConfirm && formatDisplayDate(showDeleteConfirm.start_date)} - {showDeleteConfirm && formatDisplayDate(showDeleteConfirm.end_date)}
          </span>?
          This action cannot be undone.
        </p>
      </Modal>
    </Card>
  );
};

export default AvailabilityCalendar;

