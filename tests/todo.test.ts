import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:3001/admin/api",
  cache: new InMemoryCache(),
});

afterAll(() => {
  client
    .query({
      query: gql`
        query CountAllTodos {
          _allTodosMeta {
            count
          }
        }
      `,
    })
    .then(({ data }) => {
      expect(data._allTodosMeta.count).toBe(0);
    });
});

describe("create one todo", () => {
  let id = null;
  const name = "HuyLit";
  const updatedName = "iamhuylit";
  beforeAll(async () => {
    await client
      .mutate({
        mutation: gql`
          mutation CreateOneTodo($data: TodoCreateInput) {
            createTodo(data: $data) {
              id
            }
          }
        `,
        variables: {
          data: {
            name,
          },
        },
      })
      .then(({ data }) => {
        expect(data.createTodo.id).toBeTruthy();
        expect(data.createTodo.__typename).toBe("Todo");
        id = data.createTodo.id;
      });
  });

  afterAll(async () => {
    await client
      .mutate({
        mutation: gql`
          mutation DeleteOneTodo($id: ID!) {
            deleteTodo(id: $id) {
              id
              name
              _label_
            }
          }
        `,
        variables: {
          id,
        },
      })
      .then(({ data }) => {
        expect(data.deleteTodo.id).toBe(id);
        expect(data.deleteTodo.name).toBe(updatedName);
        expect(data.deleteTodo.__typename).toBe("Todo");
        expect(data.deleteTodo._label_).toBe(updatedName);
      });
  });

  test("read one todo", async () => {
    await client
      .query({
        query: gql`
          query FindOneTodo($where: TodoWhereUniqueInput!) {
            Todo(where: $where) {
              id
              name
              _label_
            }
          }
        `,
        variables: { where: { id } },
      })
      .then(({ data }) => {
        expect(data.Todo.id).toBe(id);
        expect(data.Todo.name).toBe(name);
        expect(data.Todo.__typename).toBe("Todo");
        expect(data.Todo._label_).toBe(name);
      });
  });

  describe("update one todo", () => {
    beforeAll(async () => {
      await client
        .mutate({
          mutation: gql`
            mutation UpdateOneTodo($id: ID!, $data: TodoUpdateInput!) {
              updateTodo(id: $id, data: $data) {
                id
                name
                _label_
              }
            }
          `,
          variables: {
            id,
            data: {
              name: updatedName,
            },
          },
        })
        .then(({ data }) => {
          expect(data.updateTodo.id).toBe(id);
          expect(data.updateTodo.name).toBe(updatedName);
          expect(data.updateTodo.__typename).toBe("Todo");
          expect(data.updateTodo._label_).toBe(updatedName);
        });
    });
    test("read todos with id condition", async () => {
      await client
        .query({
          query: gql`
            query FindTodosWithId($where: TodoWhereInput!) {
              allTodos(where: $where) {
                id
                name
              }
            }
          `,
          variables: {
            where: {
              id: id,
            },
          },
        })
        .then(({ data }) => {
          const [todo] = data.allTodos;
          expect(todo.id).toBe(id);
          expect(todo.name).toBe(updatedName);
        });
    });
    test("read todos with id_not condition", async () => {
      const notId = "507f1f77bcf86cd799439011"; // different 24-char hex string
      await client
        .query({
          query: gql`
            query FindTodosWithIdNot($where: TodoWhereInput!) {
              allTodos(where: $where) {
                id
                name
              }
            }
          `,
          variables: {
            where: {
              id_not: notId,
            },
          },
        })
        .then(({ data }) => {
          const [todo] = data.allTodos;
          expect(todo.id).toBe(id);
          expect(todo.name).toBe(updatedName);
        });
    });
    test("read todos with id_in condition", async () => {
      const idInArray = [
        id,
        "507f1f77bcf86cd799439011",
        "507f1f77bcf86cd799439012",
      ]; // array containing the actual id
      await client
        .query({
          query: gql`
            query FindTodosWithIdIn($where: TodoWhereInput!) {
              allTodos(where: $where) {
                id
                name
              }
            }
          `,
          variables: {
            where: {
              id_in: idInArray,
            },
          },
        })
        .then(({ data }) => {
          const [todo] = data.allTodos;
          expect(todo.id).toBe(id);
          expect(todo.name).toBe(updatedName);
        });
    });
    test("read todos with id_not_in condition", async () => {
      const idNotInArray = [
        "507f1f77bcf86cd799439011",
        "507f1f77bcf86cd799439012",
        "507f1f77bcf86cd799439013",
      ]; // array not containing the actual id
      await client
        .query({
          query: gql`
            query FindTodosWithIdNotIn($where: TodoWhereInput!) {
              allTodos(where: $where) {
                id
                name
              }
            }
          `,
          variables: {
            where: {
              id_not_in: idNotInArray,
            },
          },
        })
        .then(({ data }) => {
          const [todo] = data.allTodos;
          expect(todo.id).toBe(id);
          expect(todo.name).toBe(updatedName);
        });
    });
    test("read todos with name_not condition", async () => {
      const notName = name + "not-that";
      await client
        .query({
          query: gql`
            query FindTodosWithNameNot($where: TodoWhereInput!) {
              allTodos(where: $where) {
                name
              }
            }
          `,
          variables: {
            where: {
              name_not: notName,
            },
          },
        })
        .then(({ data }) => {
          const [todo] = data.allTodos;
          expect(todo.name).not.toBe(notName);
        });
    });

    test("read todos with name_contains condition", async () => {
      const containsText = updatedName.slice(3, 6);
      await client
        .query({
          query: gql`
            query FindTodosWithNameContains($where: TodoWhereInput!) {
              allTodos(where: $where) {
                name
              }
            }
          `,
          variables: {
            where: {
              name_contains: containsText,
            },
          },
        })
        .then(({ data }) => {
          const [todo] = data.allTodos;
          expect(todo.name).toContain(containsText);
        });
    });

    test("read todos with name_not_contains condition", async () => {
      const allChars = "abcdefghijklmnopqrstuvwxyz";
      const notContainsText = allChars
        .split("")
        .filter((char) => !updatedName.includes(char))
        .slice(0, 3)
        .join("");
      await client
        .query({
          query: gql`
            query FindTodosWithNameNotContains($where: TodoWhereInput!) {
              allTodos(where: $where) {
                name
              }
            }
          `,
          variables: {
            where: {
              name_not_contains: notContainsText,
            },
          },
        })
        .then(({ data }) => {
          const [todo] = data.allTodos;
          expect(todo.name).not.toContain(notContainsText);
        });
    });

    test("read todos with name_starts_with condition", async () => {
      const startsWithText = updatedName.slice(0, 3);
      await client
        .query({
          query: gql`
            query FindTodosWithNameStartsWith($where: TodoWhereInput!) {
              allTodos(where: $where) {
                name
              }
            }
          `,
          variables: {
            where: {
              name_starts_with: startsWithText,
            },
          },
        })
        .then(({ data }) => {
          const [todo] = data.allTodos;
          expect(todo.name).toBe(updatedName);
        });
    });

    test("read todos with name_not_starts_with condition", async () => {
      const allChars = "abcdefghijklmnopqrstuvwxyz";
      const notStartsWithText = allChars
        .split("")
        .filter((char) => !updatedName.includes(char))
        .slice(0, 3)
        .join("");
      await client
        .query({
          query: gql`
            query FindTodosWithNameNotStartsWith($where: TodoWhereInput!) {
              allTodos(where: $where) {
                name
              }
            }
          `,
          variables: {
            where: {
              name_not_starts_with: notStartsWithText,
            },
          },
        })
        .then(({ data }) => {
          const [todo] = data.allTodos;
          expect(todo.name).toBe(updatedName);
        });
    });

    test("read todos with name_ends_with condition", async () => {
      const endsWithText = updatedName.slice(-3); // gets last 3 chars from updatedName
      await client
        .query({
          query: gql`
            query FindTodosWithNameEndsWith($where: TodoWhereInput!) {
              allTodos(where: $where) {
                name
              }
            }
          `,
          variables: {
            where: {
              name_ends_with: endsWithText,
            },
          },
        })
        .then(({ data }) => {
          const [todo] = data.allTodos;
          expect(todo.name).toBe(updatedName);
        });
    });

    test("read todos with name_not_ends_with condition", async () => {
      // Find characters not in updatedName for suffix
      const allChars = "abcdefghijklmnopqrstuvwxyz";
      const notEndsWithText = allChars
        .split("")
        .filter((char) => !updatedName.includes(char))
        .slice(0, 3)
        .join(""); // gets first 3 chars not in updatedName
      await client
        .query({
          query: gql`
            query FindTodosWithNameNotEndsWith($where: TodoWhereInput!) {
              allTodos(where: $where) {
                name
              }
            }
          `,
          variables: {
            where: {
              name_not_ends_with: notEndsWithText,
            },
          },
        })
        .then(({ data }) => {
          const [todo] = data.allTodos;
          expect(todo.name).toBe(updatedName);
        });
    });

    test("read todos with name_i condition", async () => {
      const caseInsensitiveName = updatedName.toUpperCase(); // converts to uppercase for case-insensitive match
      await client
        .query({
          query: gql`
            query FindTodosWithNameI($where: TodoWhereInput!) {
              allTodos(where: $where) {
                name
              }
            }
          `,
          variables: {
            where: {
              name_i: caseInsensitiveName,
            },
          },
        })
        .then(({ data }) => {
          const [todo] = data.allTodos;
          expect(todo.name).toBe(updatedName);
        });
    });
  });

  test("read todos with name_not_i condition", async () => {
    const notCaseInsensitiveName = updatedName.toUpperCase() + "XYZ"; // adds different chars to make it not equal
    await client
      .query({
        query: gql`
          query FindTodosWithNameNotI($where: TodoWhereInput!) {
            allTodos(where: $where) {
              name
            }
          }
        `,
        variables: {
          where: {
            name_not_i: notCaseInsensitiveName,
          },
        },
      })
      .then(({ data }) => {
        const [todo] = data.allTodos;
        expect(todo.name).toBe(updatedName);
      });
  });
  test("read todos with name_contains_i condition", async () => {
    const containsIText = updatedName.slice(3, 6).toUpperCase(); // gets "huy" and converts to "HUY"
    await client
      .query({
        query: gql`
          query FindTodosWithNameContainsI($where: TodoWhereInput!) {
            allTodos(where: $where) {
              name
            }
          }
        `,
        variables: {
          where: {
            name_contains_i: containsIText,
          },
        },
      })
      .then(({ data }) => {
        const [todo] = data.allTodos;
        expect(todo.name).toBe(updatedName);
      });
  });
  test("read todos with name_not_contains_i condition", async () => {
    // Find characters not in updatedName for case-insensitive contains
    const allChars = "abcdefghijklmnopqrstuvwxyz";
    const notContainsIText = allChars
      .split("")
      .filter((char) => !updatedName.toLowerCase().includes(char))
      .slice(0, 3)
      .join("")
      .toUpperCase(); // gets first 3 chars not in updatedName and converts to uppercase
    await client
      .query({
        query: gql`
          query FindTodosWithNameNotContainsI($where: TodoWhereInput!) {
            allTodos(where: $where) {
              name
            }
          }
        `,
        variables: {
          where: {
            name_not_contains_i: notContainsIText,
          },
        },
      })
      .then(({ data }) => {
        const [todo] = data.allTodos;
        expect(todo.name).toBe(updatedName);
      });
  });
  test("read todos with name_starts_with_i condition", async () => {
    const startsWithIText = updatedName.slice(0, 3).toUpperCase(); // gets first 3 chars and converts to uppercase
    await client
      .query({
        query: gql`
          query FindTodosWithNameStartsWithI($where: TodoWhereInput!) {
            allTodos(where: $where) {
              name
            }
          }
        `,
        variables: {
          where: {
            name_starts_with_i: startsWithIText,
          },
        },
      })
      .then(({ data }) => {
        const [todo] = data.allTodos;
        expect(todo.name).toBe(updatedName);
      });
  });
  test("read todos with name_not_starts_with_i condition", async () => {
    // Find characters not in updatedName for case-insensitive prefix
    const allChars = "abcdefghijklmnopqrstuvwxyz";
    const notStartsWithIText = allChars
      .split("")
      .filter((char) => !updatedName.toLowerCase().includes(char))
      .slice(0, 3)
      .join("")
      .toUpperCase(); // gets first 3 chars not in updatedName and converts to uppercase
    await client
      .query({
        query: gql`
          query FindTodosWithNameNotStartsWithI($where: TodoWhereInput!) {
            allTodos(where: $where) {
              name
            }
          }
        `,
        variables: {
          where: {
            name_not_starts_with_i: notStartsWithIText,
          },
        },
      })
      .then(({ data }) => {
        const [todo] = data.allTodos;
        expect(todo.name).toBe(updatedName);
      });
  });
  test("read todos with name_ends_with_i condition", async () => {
    const endsWithIText = updatedName.slice(-3).toUpperCase(); // gets last 3 chars and converts to uppercase
    await client
      .query({
        query: gql`
          query FindTodosWithNameEndsWithI($where: TodoWhereInput!) {
            allTodos(where: $where) {
              name
            }
          }
        `,
        variables: {
          where: {
            name_ends_with_i: endsWithIText,
          },
        },
      })
      .then(({ data }) => {
        const [todo] = data.allTodos;
        expect(todo.name).toBe(updatedName);
      });
  });
  test("read todos with name_not_ends_with_i condition", async () => {
    // Find characters not in updatedName for case-insensitive suffix
    const allChars = "abcdefghijklmnopqrstuvwxyz";
    const notEndsWithIText = allChars
      .split("")
      .filter((char) => !updatedName.toLowerCase().includes(char))
      .slice(0, 3)
      .join("")
      .toUpperCase(); // gets first 3 chars not in updatedName and converts to uppercase
    await client
      .query({
        query: gql`
          query FindTodosWithNameNotEndsWithI($where: TodoWhereInput!) {
            allTodos(where: $where) {
              name
            }
          }
        `,
        variables: {
          where: {
            name_not_ends_with_i: notEndsWithIText,
          },
        },
      })
      .then(({ data }) => {
        const [todo] = data.allTodos;
        expect(todo.name).toBe(updatedName);
      });
  });
  test("read todos with name_in condition", async () => {
    const nameInArray = [updatedName, name, "otherName"]; // array containing updatedName
    await client
      .query({
        query: gql`
          query FindTodosWithNameIn($where: TodoWhereInput!) {
            allTodos(where: $where) {
              name
            }
          }
        `,
        variables: {
          where: {
            name_in: nameInArray,
          },
        },
      })
      .then(({ data }) => {
        const [todo] = data.allTodos;
        expect(todo.name).toBe(updatedName);
      });
  });
  test("read todos with name_not_in condition", async () => {
    // Create array of names that don't include updatedName
    const allChars = "abcdefghijklmnopqrstuvwxyz";
    const notInName1 = allChars
      .split("")
      .filter((char) => !updatedName.includes(char))
      .slice(0, 3)
      .join("");
    const notInName2 = allChars
      .split("")
      .filter((char) => !updatedName.includes(char))
      .slice(3, 6)
      .join("");
    const nameNotInArray = [notInName1, notInName2, "anotherName"]; // array not containing updatedName
    await client
      .query({
        query: gql`
          query FindTodosWithNameNotIn($where: TodoWhereInput!) {
            allTodos(where: $where) {
              name
            }
          }
        `,
        variables: {
          where: {
            name_not_in: nameNotInArray,
          },
        },
      })
      .then(({ data }) => {
        const [todo] = data.allTodos;
        expect(todo.name).toBe(updatedName);
      });
  });
});
