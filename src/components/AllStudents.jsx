import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchStudents,
  deleteStudent,
  updateStudent,
  addStudent,
} from "../components/redux/studentsSlice";
import { logout } from "../components/redux/authSlice"; // Import the logout action
import {
  Layout,
  Menu,
  Table,
  Spin,
  Button,
  Alert,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import { toast } from "react-toastify";

const { Header, Sider, Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;

const AllStudents = () => {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.students.students);
  const status = useSelector((state) => state.students.status);
  const error = useSelector((state) => state.students.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Ensure this is set correctly
  const [collapsed, setCollapsed] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  const groups = ["Group A", "Group B", "Group C"];

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleDelete = (id) => {
    confirm({
      title: "Are you sure you want to delete this student?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        dispatch(deleteStudent(id))
          .then(() => toast.success("Student deleted successfully"))
          .catch(() => toast.error("Failed to delete student"));
      },
    });
  };

  const handleEdit = (student) => {
    setCurrentStudent(student);
    form.setFieldsValue(student);
    setIsEditModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      dispatch(updateStudent({ id: currentStudent.id, ...values }))
        .then(() => {
          toast.success("Student updated successfully");
          setIsEditModalVisible(false);
          setCurrentStudent(null);
        })
        .catch(() => toast.error("Failed to update student"));
    });
  };

  const handleAdd = () => {
    addForm.validateFields().then((values) => {
      dispatch(addStudent(values))
        .then(() => {
          toast.success("Student added successfully");
          setIsAddModalVisible(false);
          addForm.resetFields();
        })
        .catch(() => toast.error("Failed to add student"));
    });
  };

  const handleLogout = () => {
    dispatch(logout())
      .then(() => toast.success("Logged out successfully"))
      .catch(() => toast.error("Logout failed"));
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "First Name",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Group",
      dataIndex: "group",
      key: "group",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: "8px" }}
            danger
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearchText =
      student.firstname.toLowerCase().includes(searchText.toLowerCase()) ||
      student.lastname.toLowerCase().includes(searchText.toLowerCase()) ||
      student.group.toLowerCase().includes(searchText.toLowerCase());

    const matchesGroup = !selectedGroup || student.group === selectedGroup;

    return matchesSearchText && matchesGroup;
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
      >
        <div
          className="logo"
          style={{ color: "white", textAlign: "center", padding: "10px" }}
        >
          {collapsed ? null : "Student App"}
        </div>
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1">All Students</Menu.Item>
          <Menu.Item key="2" onClick={() => setIsAddModalVisible(true)}>
            Add Student
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Input
              placeholder="Search students"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 400, margin: "32px" }}
            />
            <Select
              placeholder="Select group"
              value={selectedGroup}
              onChange={(value) => setSelectedGroup(value)}
              style={{ width: 200 }}
            >
              <Option value="">All Groups</Option>
              {groups.map((group) => (
                <Option key={group} value={group}>
                  {group}
                </Option>
              ))}
            </Select>
          </div>
          {isAuthenticated && (
            <Button
              onClick={handleLogout}
              style={{ margin: "16px" }}
              type="primary"
            >
              Logout
            </Button>
          )}
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <div
            style={{
              padding: 24,
              background: "#fff",
              minHeight: 360,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            {status === "loading" ? (
              <Spin size="large" />
            ) : status === "failed" ? (
              <Alert message={error} type="error" />
            ) : (
              <Table
                dataSource={filteredStudents}
                columns={columns}
                rowKey="id"
              />
            )}
          </div>
        </Content>
      </Layout>
      <Modal
        title="Edit Student"
        visible={isEditModalVisible}
        onOk={handleSave}
        onCancel={() => {
          setIsEditModalVisible(false);
          setCurrentStudent(null);
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="edit_student_form"
          initialValues={currentStudent}
        >
          <Form.Item
            name="firstname"
            label="First Name"
            rules={[{ required: true, message: "Please enter the first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastname"
            label="Last Name"
            rules={[{ required: true, message: "Please enter the last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="group"
            label="Group"
            rules={[{ required: true, message: "Please select a group" }]}
          >
            <Select placeholder="Select a group">
              {groups.map((group) => (
                <Option key={group} value={group}>
                  {group}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Add Student"
        visible={isAddModalVisible}
        onOk={handleAdd}
        onCancel={() => {
          setIsAddModalVisible(false);
        }}
      >
        <Form form={addForm} layout="vertical" name="add_student_form">
          <Form.Item
            name="firstname"
            label="First Name"
            rules={[{ required: true, message: "Please enter the first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastname"
            label="Last Name"
            rules={[{ required: true, message: "Please enter the last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="group"
            label="Group"
            rules={[{ required: true, message: "Please select a group" }]}
          >
            <Select placeholder="Select a group">
              {groups.map((group) => (
                <Option key={group} value={group}>
                  {group}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AllStudents;
