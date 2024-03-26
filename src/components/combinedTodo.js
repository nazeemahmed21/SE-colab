import { format, parse } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  motion,
  useTransform,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { MdOutlineClose, MdDelete, MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/todo.module.css";
import {
  deleteTodoAsync,
  updateFilterStatus,
  addTodoAsync,
  updateTodoAsync,
  fetchTodosAsync,
} from "../slices/todoSlice";

const getClasses = (classes) =>
  classes
    .filter((item) => item !== "")
    .join(" ")
    .trim();

const buttonType = {
  primary: "primary",
  secondary: "secondary",
};

const checkVariants = {
  initial: {
    color: "#ffffff",
  },
  checked: {
    pathLength: 1,
  },
  unchecked: {
    pathLength: 0,
  },
};

const boxVariant = {
  checked: {
    background: "#29ada0",
    transition: { duration: 0.15 },
  },
  unchecked: {
    background: "#eee",
    transition: { duration: 0.15 },
  },
};

const dropIn = {
  hidden: {
    opacity: 0,
    transform: "scale(0.9)",
  },
  visible: {
    opacity: 1,
    transform: "scale(1)",
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    opacity: 0,
    transform: "scale(0.9)",
  },
};

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const child = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const child2 = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

function Button({ children, type, variant, ...rest }) {
  return (
    <button
      className={getClasses([
        styles.todo_button,
        styles[`todo_button__${buttonType[variant]}`],
      ])}
      type={type === "submit" ? "submit" : "button"}
      {...rest}
    >
      {children}
    </button>
  );
}

function SelectButton({ children, value, ...rest }) {
  return (
    <select
      className={getClasses([styles.todo_button, styles.todo_button__select])}
      value={value}
      {...rest}
    >
      {children}
    </select>
  );
}

function CheckButton({ checked, handleCheck }) {
  const pathLength = useMotionValue(0);
  const opacity = useTransform(pathLength, [0.05, 0.15], [0, 1]);

  return (
    <motion.div
      className={styles.todo_svgBox}
      variants={boxVariant}
      animate={checked ? "checked" : "unchecked"}
      onClick={() => {
        handleCheck(!checked);
      }}
    >
      <motion.svg
        className={styles.todo_svg}
        viewBox="0 0 53 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          animate={checked ? "checked" : "unchecked"}
          style={{ pathLength, opacity }}
          variants={checkVariants}
          fill="none"
          strokeMiterlimit="10"
          strokeWidth="6"
          d="M1.5 22L16 36.5L51.5 1"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </motion.svg>
    </motion.div>
  );
}

function TodoModal({ type, modalOpen, setModalOpen, todo }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("incomplete");
  const [dueDate, setDueDate] = useState(new Date());
  const dispatch = useDispatch();

  useEffect(() => {
    if (type === "update" && todo) {
      setTitle(todo.title);
      setStatus(todo.status);
      setDueDate(new Date(todo.time));
    } else {
      setTitle("");
      setStatus("incomplete");
      setDueDate(new Date());
    }
  }, [todo, type, modalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title === "") {
      toast.error("Please enter task title");
      return;
    }

    try {
      const formattedDueDate = format(dueDate, "MM/dd/yyyy, h:mm:ss a");

      if (type === "add") {
        const docRef = await dispatch(
          addTodoAsync({
            title,
            status,
            time: formattedDueDate,
          })
        );
        toast.success("Task added successfully");
      }

      if (type === "update") {
        const formattedTodoDate = format(
          new Date(todo.time),
          "MM/dd/yyyy, h:mm:ss a"
        );

        if (
          todo.title !== title ||
          todo.status !== status ||
          formattedTodoDate !== formattedDueDate
        ) {
          await dispatch(
            updateTodoAsync({
              ...todo,
              title,
              status,
              time: formattedDueDate,
            })
          );
          toast.success("Task updated successfully");
        } else {
          toast.error("No changes made");
          return;
        }
      }
    } catch (error) {
      console.error("Error handling form submission:", error);
      toast.error("An error occurred. Please try again.");
    }

    setModalOpen(false);
  };
  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className={styles.todo_wrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.todo_containerr}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className={styles.todo_closeButton}
              onClick={() => setModalOpen(false)}
              onKeyDown={() => setModalOpen(false)}
              tabIndex={0}
              role="button"
              initial={{ opacity: 0, top: 40 }}
              animate={{ opacity: 1, top: -10 }}
              exit={{ opacity: 0, top: 40 }}
            >
              <MdOutlineClose />
            </motion.div>
            <form
              className={styles.todo_form}
              onSubmit={(e) => handleSubmit(e)}
            >
              <h1 className={styles.todo_formTitle}>
                {type === "update" ? "Update " : "Add "}
                Task
              </h1>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label htmlFor="status">
                Status
                <select
                  name="status"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="incomplete">Incomplete</option>
                  <option value="complete">Complete</option>
                </select>
              </label>
              <label htmlFor="dueDate">
                Due Date
                <DatePicker
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  id="dueDate"
                />
              </label>
              <div className={styles.todo_buttonContainer}>
                <Button type="submit" variant="primary">
                  {type === "update" ? "Update " : "Add "}
                  Task
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setModalOpen(false)}
                  onKeyDown={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PageTitle({ children, ...rest }) {
  return (
    <p className={styles.todo_title} {...rest}>
      {children}
    </p>
  );
}

function AppContent() {
  const todoList = useSelector((state) => state.todo.todoList);
  const filterStatus = useSelector((state) => state.todo.filterStatus);
  const sortedTodoList = [...todoList];
  sortedTodoList.sort((a, b) => new Date(b.time) - new Date(a.time));

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTodosAsync());
    dispatch(updateFilterStatus("incomplete"));
  }, [dispatch]);

  const filterTodoList = sortedTodoList.filter((item) => {
    if (filterStatus === "incomplete" && item.status === "incomplete") {
      return true;
    }
    if (filterStatus === "complete" && item.status === "complete") {
      return true;
    }
    if (filterStatus === "all") {
      return true;
    }
    return false;
  });

  return (
    <motion.div
      className={styles.todo_content__wrapper}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {filterTodoList && filterTodoList.length > 0 ? (
          filterTodoList.map((todo) => <TodoItem key={todo.id} todo={todo} />)
        ) : (
          <motion.p className={styles.todo_emptyText} variants={child}>
            No Todos Made
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TodoItem({ todo }) {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const parsedDate = parse(todo.time, "MM/dd/yyyy, h:mm:ss a", new Date());
  const formattedDate = format(parsedDate, "p, MM/dd/yyyy");

  useEffect(() => {
    if (todo.status === "complete") {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [todo.status]);

  const handleDelete = () => {
    dispatch(deleteTodoAsync(todo.id));
    toast.success("Task deleted successfully");
  };

  const handleUpdate = () => {
    setUpdateModalOpen(true);
  };

  const handleCheck = () => {
    setChecked(!checked);
    dispatch(
      updateTodoAsync({
        ...todo,
        status: checked ? "incomplete" : "complete",
      })
    );
  };
  return (
    <>
      <motion.div className={styles.todo_item} variants={child2}>
        <div className={styles.todo_todoDetails}>
          <CheckButton checked={checked} handleCheck={handleCheck} />
          <div className={styles.todo_texts}>
            <p
              className={getClasses([
                styles.todo_todoText,
                todo.status === "complete" &&
                  styles["todo_todoText--completed"],
              ])}
            >
              {todo.title}
            </p>
            <p className={styles.todo_time}>{formattedDate}</p>
          </div>
        </div>
        <div className={styles.todo_Actions}>
          <div
            className={styles.todo_icon}
            onClick={handleDelete}
            onKeyDown={handleDelete}
            role="button"
            tabIndex={0}
          >
            <MdDelete />
          </div>
          <div
            className={styles.todo_icon}
            onClick={handleUpdate}
            onKeyDown={handleUpdate}
            role="button"
            tabIndex={0}
          >
            <MdEdit />
          </div>
        </div>
      </motion.div>
      <TodoModal
        type="update"
        todo={todo}
        modalOpen={updateModalOpen}
        setModalOpen={setUpdateModalOpen}
      />
    </>
  );
}

function AppHeader() {
  const [modalOpen, setModalOpen] = useState(false);
  const filterStatus = useSelector((state) => state.todo.filterStatus);
  const dispatch = useDispatch();

  const updateFilter = (e) => {
    dispatch(updateFilterStatus(e.target.value));
  };

  return (
    <div className={styles.todo_appHeader}>
      <Button variant="primary" onClick={() => setModalOpen(true)}>
        Add Task
      </Button>
      <SelectButton
        id="status"
        value={filterStatus}
        onChange={updateFilter}
        defaultValue="incomplete"
      >
        <option value="all">All</option>
        <option value="incomplete">Incomplete</option>
        <option value="complete">Complete</option>
      </SelectButton>
      <TodoModal type="add" modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </div>
  );
}

export {
  SelectButton,
  CheckButton,
  TodoModal,
  PageTitle,
  AppContent,
  TodoItem,
  AppHeader,
};
export default Button;
