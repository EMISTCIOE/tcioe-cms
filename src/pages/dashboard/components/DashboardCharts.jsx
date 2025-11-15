import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MainCard from '@/components/cards/MainCard';
import ReactApexChart from 'react-apexcharts';

// ==============================|| DASHBOARD CHARTS ||============================== //

export default function DashboardCharts({ chartData }) {
  const theme = useTheme();

  // Notices Trend Chart
  const noticesChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: chartData.noticesTrend?.map((item) => item.month) || [],
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Notices',
        style: {
          color: theme.palette.text.secondary
        }
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter(val) {
          return `${val} notices`;
        }
      }
    },
    colors: [theme.palette.success.main],
    grid: {
      borderColor: theme.palette.divider
    }
  };

  const noticesSeries = [
    {
      name: 'Notices',
      data: chartData.noticesTrend?.map((item) => item.count) || []
    }
  ];

  // Users Growth Chart
  const usersChartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: chartData.usersGrowth?.map((item) => item.month) || [],
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Users',
        style: {
          color: theme.palette.text.secondary
        }
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    tooltip: {
      y: {
        formatter(val) {
          return `${val} users`;
        }
      }
    },
    colors: [theme.palette.primary.main],
    grid: {
      borderColor: theme.palette.divider
    }
  };

  const usersSeries = [
    {
      name: 'New Users',
      data: chartData.usersGrowth?.map((item) => item.count) || []
    }
  ];

  // Research Publications Chart
  const researchChartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    markers: {
      size: 5,
      hover: {
        size: 7
      }
    },
    xaxis: {
      categories: chartData.researchPublicationsTrend?.map((item) => item.month) || [],
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      title: {
        text: 'Publications',
        style: {
          color: theme.palette.text.secondary
        }
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    tooltip: {
      y: {
        formatter(val) {
          return `${val} publications`;
        }
      }
    },
    colors: [theme.palette.info.main],
    grid: {
      borderColor: theme.palette.divider
    }
  };

  const researchSeries = [
    {
      name: 'Research Publications',
      data: chartData.researchPublicationsTrend?.map((item) => item.count) || []
    }
  ];

  // Events Trend Chart
  const eventsChartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: chartData.eventsTrend?.map((item) => item.month) || [],
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Events',
        style: {
          color: theme.palette.text.secondary
        }
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    tooltip: {
      y: {
        formatter(val) {
          return `${val} events`;
        }
      }
    },
    colors: [theme.palette.secondary.main],
    grid: {
      borderColor: theme.palette.divider
    }
  };

  const eventsSeries = [
    {
      name: 'Events',
      data: chartData.eventsTrend?.map((item) => item.count) || []
    }
  ];

  // Projects Trend Chart
  const projectsChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '60%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: chartData.projectsTrend?.map((item) => item.month) || [],
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Projects',
        style: {
          color: theme.palette.text.secondary
        }
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter(val) {
          return `${val} projects`;
        }
      }
    },
    colors: [theme.palette.warning.main],
    grid: {
      borderColor: theme.palette.divider
    }
  };

  const projectsSeries = [
    {
      name: 'Projects',
      data: chartData.projectsTrend?.map((item) => item.count) || []
    }
  ];

  return (
    <Grid container spacing={2.75}>
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Trends & Analytics
        </Typography>
      </Grid>

      {/* Events Trend Chart */}
      <Grid item xs={12}>
        <MainCard>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Events Created (Last 6 Months)
          </Typography>
          <ReactApexChart options={eventsChartOptions} series={eventsSeries} type="area" height={350} />
        </MainCard>
      </Grid>

      {/* Projects and Research Charts Side by Side */}
      <Grid item xs={12} md={6}>
        <MainCard>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Projects Created (Last 6 Months)
          </Typography>
          <ReactApexChart options={projectsChartOptions} series={projectsSeries} type="bar" height={350} />
        </MainCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <MainCard>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Research Publications (Last 12 Months)
          </Typography>
          <ReactApexChart options={researchChartOptions} series={researchSeries} type="line" height={350} />
        </MainCard>
      </Grid>

      {/* Notices Published Chart */}
      <Grid item xs={12}>
        <MainCard>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Notices Published (Last 6 Months)
          </Typography>
          <ReactApexChart options={noticesChartOptions} series={noticesSeries} type="bar" height={350} />
        </MainCard>
      </Grid>
    </Grid>
  );
}
