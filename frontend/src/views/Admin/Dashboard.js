import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter, CardTitle, Row, Col, Button } from "reactstrap";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from "react-chartjs-2";
import logonamin from "Dpreplogo.png"
function Dashboard() {
  // Dummy data for demonstration
  const [disasters, setDisasters] = useState([]);
  const [reports, setReport] = useState([]);
  const [areas, setArea] = useState([]);
  const [numberOfDisasters, setNumberOfDisasters] = useState(0);
  const [numberOfArea, setNumberOfArea] = useState(0);
  const [numberOfMedia, setNumberOfMedia] = useState(0);
  const [numberOfig, setNumberOfIg] = useState(0);
  const [overallReports, setNumberOfReports] = useState(0);
  const [currentYearReports, setCurrentYearReports] = useState(0);
  const [userCreationData, setUserCreationData] = useState([]);
  const [disastersByAreaData, setDisastersByAreaData] = useState([]);

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/v1/disasters');
        const mediaResponse = await fetch('http://localhost:4001/api/v1/media');
        const reportResponse = await axios.get('http://localhost:4001/api/v1/reports');
        const areaResponse = await fetch("http://localhost:4001/api/v1/area");
        const igResponse = await fetch("http://localhost:4001/api/v1/ig");
        const responseUsers = await axios.get('http://localhost:4001/api/v1/admin/users');
        const areaData = await areaResponse.json();
        const igData = await igResponse.json();
        const mediaData = await mediaResponse.json();
        const usersData = await responseUsers.data.users;
        setDisasters(response.data.disasters);
        setArea(areaData.area);
        setReport(reportResponse.data.reports);
        setNumberOfDisasters(response.data.disasters.length);
        setNumberOfMedia(mediaData.media.length);
        setNumberOfIg(igData.ig.length);
        setNumberOfReports(reportResponse.data.reports.length);
        setNumberOfArea(areaData.area.length);
        setCurrentYearReports(calculateCurrentYearReports(reportResponse.data.reports));
        setUserCreationData(calculateUserCreationData(usersData));
        const disastersByArea = await getDisastersByArea(reportResponse.data.reports, areaData.area);
        setDisastersByAreaData(disastersByArea);
        console.log(disastersByArea)
        console.log(reports)
      } catch (error) {
       
        console.error('Error fetching disasters:', error);
      }
    };

    fetchDisasters();
  }, []);

  const calculateCurrentYearReports = (reports) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    return reports.filter(report => new Date(report.date).getFullYear() === currentYear).length;
  };

  const calculateUserCreationData = (users) => {
    const monthlyData = Array.from({ length: 12 }, () => 0);
    users.forEach(user => {
      const month = new Date(user.createdAt).getMonth();
      monthlyData[month]++;
    });
    return monthlyData;
  };

  const getDisastersByArea = async (reports,areas) => {
    try {
      const disastersByArea = areas.map(area => {
        const disasterCount = reports.filter(report => report.area._id === area._id).length;
        return { areaName: area.bname, disasterCount };
      });

      return disastersByArea;
    } catch (error) {
      console.error('Error getting disasters by area:', error);
      throw error;
    }
  };

  const chartData = {
    labels: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    datasets: [
      {
        label: "Number of Users Created",
        data: userCreationData,
        fill: false,
        borderColor: "#4caf50",
      },
    ],
  };

  const chartData1 = {
    labels: disastersByAreaData.map(item => item.areaName),
    datasets: [
      {
        label: 'Number of Disasters',
        data: disastersByAreaData.map(item => item.disasterCount),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="content">
      <div style={{ textAlign: 'center' }}>
      <img
        src={logonamin} // Replace this URL with the URL of your image
        alt="Image above form"
        style={{ width: "10%", height: "auto" }}
      />
    </div>
      <Row>
      
        {/* Card for current year reports */}
        <Col lg="3" md="6" sm="6">
          <Card className="card-stats">
            <CardBody>
              <Row>
                <Col md="4" xs="5">
                  <div className="icon-big text-center icon-warning">
                    <i className="nc-icon nc-tap-01 text-warning" />
                  </div>
                </Col>
                <Col md="8" xs="7">
                  <div className="numbers">
                    <p className="card-category">Current</p>
                    <p className="card-category">Year Reports</p>
                    <CardTitle tag="p">{currentYearReports}</CardTitle>
                    <p />
                  </div>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Button tag={Link} to="/admin/reports" className="btn-fill" color="warning">
                More
              </Button>
            </CardFooter>
          </Card>
        </Col>

        {/* Card for overall reports */}
        <Col lg="3" md="6" sm="6">
          <Card className="card-stats">
            <CardBody>
              <Row>
                <Col md="4" xs="5">
                  <div className="icon-big text-center icon-warning">
                    <i className="nc-icon nc-calendar-60 text-success" />
                  </div>
                </Col>
                <Col md="8" xs="7">
                  <div className="numbers">
                    <p className="card-category">Overall</p>
                    <p className="card-category">Reports</p>
                    <CardTitle tag="p">{overallReports}</CardTitle>
                    <p />
                  </div>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Button tag={Link} to="/admin/reports" className="btn-fill" color="success">
                More
              </Button>
            </CardFooter>
          </Card>
        </Col>

        {/* Card for number of disasters */}
        <Col lg="3" md="6" sm="6">
          <Card className="card-stats">
            <CardBody>
              <Row>
                <Col md="4" xs="5">
                  <div className="icon-big text-center icon-warning">
                    <i className="nc-icon nc-support-17 text-danger" />
                  </div>
                </Col>
                <Col md="8" xs="7">
                  <div className="numbers">
                    <p className="card-category">Number</p>
                    <p className="card-category">of Disasters</p>
                    <CardTitle tag="p">{numberOfDisasters}</CardTitle>
                    <p />
                  </div>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Button tag={Link} to="/admin/disaster" className="btn-fill" color="danger">
                More
              </Button>
            </CardFooter>
          </Card>
        </Col>

        {/* Card for number of data */}
        <Col lg="3" md="6" sm="6">
          <Card className="card-stats">
            <CardBody>
              <Row>
                <Col md="4" xs="5">
                  <div className="icon-big text-center icon-warning">
                    <i className="nc-icon nc-pin-3 text-info" />
                  </div>
                </Col>
                <Col md="8" xs="7">
                  <div className="numbers">
                    <p className="card-category">Number</p>
                    <p className="card-category">of Areas</p>
                    <CardTitle tag="p">{numberOfArea}</CardTitle>
                    <p />
                  </div>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Button tag={Link} to="/admin/area" className="btn-fill" color="info">
                More
              </Button>
            </CardFooter>
          </Card>
        </Col>
        <Col lg="6" md="12" className="text-center">
          <Card className="card-chart">
            <CardHeader>
              <CardTitle tag="h5">User Creation Monthly</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="chart-area">
                <Line data={chartData} />
              </div>
            </CardBody>
            <CardFooter>
              <div className="stats">
              
              </div>
            </CardFooter>
          </Card>
        </Col>
        <Col lg="6" md="12" className="text-center">
          <Card className="card-chart">
            <CardHeader>
              <CardTitle tag="h5">Disasters by Area</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="chart-area">
                <Bar data={chartData1} />
              </div>
            </CardBody>
            <CardFooter>
              <div className="stats">
               
              </div>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
