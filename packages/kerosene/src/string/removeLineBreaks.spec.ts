import removeLineBreaks from "./removeLineBreaks";

describe('#removeLineBreaks', () => {

  it('should replace any instances of Line Feed characters found in the text with a space char', () => {
    expect(
        removeLineBreaks('\n')
    ).toBe(
        ' '
    );

    expect(
        removeLineBreaks('\n\nHello\n\nWorld\n\n')
    ).toBe(
        '  Hello  World  '
    );
  });

  it('should replace any instances of the Carriage Return character found in the text with a space char', () => {
    expect(
        removeLineBreaks('\r')
    ).toBe(
        ' '
    );

    expect(
        removeLineBreaks('\r\rHello\r\rWorld\r\r')
    ).toBe(
        '  Hello  World  '
    );
  });

  it('should return the input as-is if there are no Line Feed or Carriage Return characters in the text', () => {
    expect(
        removeLineBreaks('hey what up')
    ).toBe(
        'hey what up'
    );
  });

});
