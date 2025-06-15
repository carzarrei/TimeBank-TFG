import jwt from 'jsonwebtoken';
import verifyLogin from '../../middlewares/CheckAuth.js';
import { invalidAuth } from '../../errorMessages.js';

jest.mock('jsonwebtoken');

describe('Middleware: verifyLogin', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('debe responder con 401 si no se proporciona token', () => {
    verifyLogin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith(invalidAuth);
    expect(next).not.toHaveBeenCalled();
  });

  test('debe responder con 403 si el token es inválido', () => {
    req.headers['authorization'] = 'invalid.token.here';
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Token inválido'), null);
    });

    verifyLogin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith(invalidAuth);
    expect(next).not.toHaveBeenCalled();
  });

  test('debe asignar req.user y llamar a next() si el token es válido', () => {
    const decoded = { id: '123', email: 'test@example.com' };
    req.headers['authorization'] = 'valid.token.here';

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, decoded);
    });

    verifyLogin(req, res, next);

    expect(req.user).toEqual(decoded);
    expect(next).toHaveBeenCalled();
  });
});
