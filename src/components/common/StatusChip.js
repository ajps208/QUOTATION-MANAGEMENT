import { Chip } from '@mui/material';
import { 
  QUOTATION_STATUS, 
  REQUEST_STATUS, 
  PRODUCT_STATUS, 
  BUSINESS_STATUS 
} from '@/constants/statuses';

const getStatusColor = (status) => {
  switch (status) {
    case QUOTATION_STATUS.ACCEPTED:
    case REQUEST_STATUS.APPROVED:
    case PRODUCT_STATUS.ACTIVE:
    case BUSINESS_STATUS.ACTIVE:
    case REQUEST_STATUS.CONVERTED_TO_QUOTATION:
      return 'success';
      
    case QUOTATION_STATUS.REJECTED:
    case REQUEST_STATUS.REJECTED:
    case PRODUCT_STATUS.INACTIVE:
    case BUSINESS_STATUS.INACTIVE:
    case QUOTATION_STATUS.CANCELLED:
      return 'error';
      
    case QUOTATION_STATUS.SENT:
    case QUOTATION_STATUS.VIEWED:
    case REQUEST_STATUS.SUBMITTED:
      return 'info';
      
    case QUOTATION_STATUS.CHANGES_REQUESTED:
    case QUOTATION_STATUS.REVISED:
    case QUOTATION_STATUS.EXPIRED:
    case REQUEST_STATUS.UNDER_REVIEW:
    case REQUEST_STATUS.CHANGES_REQUESTED:
      return 'warning';
      
    case QUOTATION_STATUS.DRAFT:
    case REQUEST_STATUS.DRAFT:
    default:
      return 'default';
  }
};

export default function StatusChip({ status, label, ...props }) {
  const displayLabel = label || status;
  const color = getStatusColor(status);
  
  return (
    <Chip 
      label={displayLabel} 
      color={color} 
      size="small" 
      sx={{ fontWeight: 600 }}
      {...props} 
    />
  );
}
