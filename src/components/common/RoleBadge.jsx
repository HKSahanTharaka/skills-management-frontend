import Badge from './Badge';

const RoleBadge = ({ role }) => {
  const getRoleVariant = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'red';
      case 'manager':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getRoleLabel = (role) => {
    return role?.charAt(0).toUpperCase() + role?.slice(1).toLowerCase() || 'Unknown';
  };

  return (
    <Badge variant={getRoleVariant(role)}>
      {getRoleLabel(role)}
    </Badge>
  );
};

export default RoleBadge;

