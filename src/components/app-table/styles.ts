import { SxProps, Theme } from '@mui/material/styles';

/**
 * Returns table styles based on the MUI theme.
 */
export const TableStyles: SxProps<Theme> = (theme) => ({
  // Sorting icon visibility
  '& .MuiDataGrid-sortIcon': {
    opacity: '1 !important',
    visibility: 'visible'
  },

  border: 'none',

  // scrollbar styles
  '& .MuiDataGrid-scrollbar--horizontal::-webkit-scrollbar': {
    scrollbarWidth: 'thin',
    height: '6px'
  },
  '& .MuiDataGrid-scrollbar--horizontal::-webkit-scrollbar-track': {
    background: '#eee'
  },
  '& .MuiDataGrid-scrollbar--horizontal::-webkit-scrollbar-thumb': {
    backgroundColor: '#ccc'
  },
  '& .MuiDataGrid-scrollbar--horizontal::-webkit-scrollbar-thumb:hover': {
    background: '#aaa'
  },

  // Column header styles
  '& .MuiDataGrid-columnHeaders': {
    '--unstable_DataGrid-headWeight': 900,
    '--unstable_DataGrid-radius': 0,
    borderBottom: '1.5px solid ',
    borderTop: '1.5px solid',
    borderBottomColor: theme.palette.divider,
    borderTopColor: theme.palette.divider,
    // @ts-ignore
    '--DataGrid-containerBackground': theme.palette.default
  },

  '& .MuiDataGrid-columnHeader': {
    paddingInline: theme.spacing(1.25),
    minHeight: { xs: 44, sm: 56 },
    '& .MuiDataGrid-menuIcon': {
      marginLeft: 'auto',
      justifyContent: 'flex-end'
    },
    '& .MuiDataGrid-columnSeparator': {
      color: theme.palette.divider
    },
    '& .MuiDataGrid-checkboxInput': {
      scale: 1.1
    }
  },

  // Row styles
  '& .MuiDataGrid-row': {
    fontSize: { xs: theme.typography.body2.fontSize, sm: theme.typography.h6.fontSize },
    '--DataGrid-rowBorderColor': theme.palette.divider,

    // Cell styles
    '& .MuiDataGrid-cell': {
      paddingInline: theme.spacing(1.25),
      '&:focus-within': {
        outline: 'none'
      },
      '&.MuiDataGrid-cell--editing': {
        overflow: 'visible',
        paddingInline: theme.spacing(1.25),
        '&:focus-within': {
          outline: 'none'
        }
      }
    },

    '& .MuiDataGrid-cellEmpty': {
      paddingInline: 0,
      mr: 0
    },

    '&.MuiDataGrid-row--editing': {
      boxShadow: 'none'
    }
  },

  '& .MuiDataGrid-toolbarContainer': {
    flexWrap: 'wrap',
    rowGap: theme.spacing(1),
    justifyContent: 'space-between',
    p: theme.spacing(1.5, 2)
  }
});
/**
 * Box styles for table container
 */
export const BoxStyles: SxProps<Theme> = {
  overflowX: 'auto',
  border: '1px solid',
  borderRadius: 1,
  borderColor: (theme) => theme.palette.divider,
  backgroundColor: (theme) => theme.palette.background.paper,
  height: '100%',
  minHeight: { xs: 420, sm: 'auto' }
};
