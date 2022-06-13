const { nanoid } = require('nanoid');
const books = require('./books');

// menyimpan buku
const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;
  if (pageCount === readPage) {
    finished = true;
  }

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query;

  let newBooks = books;

  // menampilkan buku yang sudah dibaca atau belum
  if (reading) {
    // menampilkan buku yang sudah dibaca
    if (reading === '1') {
      newBooks = books.filter((book) => book.reading === true);
    } else {
      // menampilkan buku yang belum dibaca
      newBooks = books.filter((book) => book.reading === false);
    }
  }

  // menampilkan buku yang sudah tamat dibaca atau belum
  if (finished) {
    // menampilkan buku yang sudah tamat dibaca
    if (finished === '1') {
      newBooks = books.filter((book) => book.finished === true);
    } else {
      // menampilkan buku yang belum tamat dibaca
      newBooks = books.filter((book) => book.finished === false);
    }
  }

  // menampilkan buku sesusai nama yang diinginkan
  if (name) {
    newBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: newBooks.map((item) => ({ id: item.id, name: item.name, publisher: item.publisher })),
    },
  });
  response.code(200);
  return response;
};

// menampilkan detail buku
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.find((a) => a.id === bookId);

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: { book },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// mengubah data buku
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// menghapus buku
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
