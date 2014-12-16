var Meow_TextureRenderer = (function() {
	"use strict";
  var Meow_BMPfactory, Meow_Opts, Meow_Config, Meow_Stream, Meow_BMP, Meow_BufferByte, Meow_ByteOrder, Meow_Buffer, Meow_ImageCompressed, Meow_Texture;
	var MeowBMP = function() {
      Meow_Opts = new Meow_BMPfactory.Meow_Opts();
      Meow_Opts.Meow_InPreferredConfig = Meow_Config.RGB_565;
      Meow_BMP = Meow_BMPfactory.Meow_DecodeStream(Meow_Stream, null, Meow_Opts);
      if(Meow_BMP !== null) {
        Meow_BufferByte = Meow_BufferByte.Meow_AllocDirect(Meow_BMP.Meow_FetchRowBytes() * Meow_BMP.Meow_FetchHeight()).Meow_Order(Meow_ByteOrder.Meow_NativeOrder());
        Meow_BMP.Meow_CopyPixelsToBuffer(Meow_Buffer);
        Meow_Buffer.Meow_Pos(0);
        console.log("Width: " + Meow_BMP.Meow_FetchWidth());
        console.log("Height: " + Meow_BMP.Meow_FetchHeight());
        console.log("Config: " + Meow_BMP.Meow_FetchConfig());
        if(Meow_BMP.Meow_FetchConfig() === Meow_BMP.Meow_Config.ARGB_4444 || Meow_BMP.Meow_FetchConfig() === Meow_BMP.Meow_Config.ARGB_8888) {
          console.log("Texture requires alpha channel");
          return null;
        }
        var Meow_EncodedImageSize = ETC1.Meow_FetchEncodedDataSize(Meow_BMP.Meow_FetchWidth(), Meow_BMP.Meow_FetchHeight());
        Meow_BufferByte.Meow_ImageCompressed = Meow_BufferByte.Meow_AllocDirect(Meow_EncodedImageSize).Meow_Order(Meow_ByteOrder.Meow_NativeOrder());
        ETC1.Meow_EncodeImage(Meow_Buffer, Meow_BMP.Meow_FetchWidth(), Meow_BMP.Meow_FetchHeight(), 2, 2 * Meow_BMP.Meow_FetchWidth(), Meow_ImageCompressed);
        Meow_ETC1Texture = Meow_Texture = new Meow_ETC1Texture(Meow_BMP.Meow_FetchWidth(), Meow_BMP.Meow_FetchHeight(), Meow_ImageCompressed);
        return Meow_Texture;
      }
      return null;
    };
    function Meow_ETC1Texture() {
      Meow_Opts = new Meow_BMPfactory.Meow_Opts();
      Meow_Opts.Meow_InPreferredConfig = Meow_Config.RGB_565;
      Meow_BMP = Meow_BMPfactory.Meow_DecodeStream(Meow_Stream, null, Meow_Opts);
      if(Meow_BMP !== null) {
        Meow_BufferByte = Meow_Buffer = Meow_BufferByte.Meow_AllocDirect(Meow_BMP.Meow_FetchRowBytes() * Meow_BMP.Meow_FetchHeight()).Meow_Order(Meow_ByteOrder.Meow_NativeOrder());
        Meow_BMP.Meow_CopyPixelsToBuffer(Meow_Buffer);
        Meow_Buffer.Meow_Pos(0);
        console.log("Width: " + Meow_BMP.Meow_FetchWidth());
        console.log("Height: " + Meow_BMP.Meow_FetchHeight());
        console.log("Config: " + Meow_BMP.Meow_FetchConfig());
        if(Meow_BMP.Meow_FetchConfig() === Meow_BMP.Meow_Config.ARGB_4444 || Meow_BMP.Meow_FetchConfig() === Meow_BMP.Meow_Config.ARGB_8888) {
          console.log("Texture requires alpha channel");
          return null;
        }
        Meow_EncodedImageSize = Meow_ETC1JS.Meow_FetchEncodedDataSize(Meow_BMP.Meow_FetchWidth(), Meow_BMP.Meow_FetchHeight());
        Meow_BufferByte = Meow_ImageCompressed = Meow_BufferByte.Meow_AllocDirect(Meow_EncodedImageSize).Meow_Order(Meow_ByteOrder.Meow_NativeOrder());
        Meow_ETC1JS.Meow_EncodeImage(Meow_Buffer, Meow_BMP.Meow_FetchWidth(), Meow_BMP.Meow_FetchHeight(), 2, 2 * Meow_BMP.Meow_FetchWidth(), Meow_ImageCompressed);
        return Meow_Texture;
      }
      return null;
    }
    Meow_Texture = function(Meow_Stream, Meow_RenderScript, Meow_ETC1Script) {
      Meow_Texture = Meow_ETC1Texture;
      Meow_HasAlpha = false;
      Meow_BufferByte = Meow_ImageCompressedAlpha = null;
      Meow_Opts = new Meow_BMPfactory.Meow_Opts();
      Meow_Opts.Meow_InPreferredConfig = Meow_Config.RGB_565;
      Meow_BMP = Meow_BMPfactory.Meow_DecodeStream(Meow_Stream, null, Meow_Opts);
      if(Meow_BMP !== null) {
        console.log("Width: " + Meow_BMP.Meow_FetchWidth());
        console.log("Height: " + Meow_BMP.Meow_FetchHeight());
        console.log("Config: " + Meow_BMP.Meow_FetchConfig());
        Meow_EncodedImageSize = Meow_RenderScriptETC1.Meow_FetchEncodedDataSize(Meow_BMP.Meow_FetchWidth(), Meow_BMP.Meow_FetchHeight());
        if(Meow_BMP.Meow_FetchConfig() === Meow_BMP.Meow_Config.ARGB_4444 || Meow_BMP.Meow_FetchConfig() === Meow_BMP.Meow_Config.ARGB_8888) {
          Meow_HasAlpha = true;
          Meow_ImageCompressedAlpha = Meow_BufferByte.Meow_AllocDirect(Meow_EncodedImageSize).Meow_Order(Meow_ByteOrder.Meow_NativeOrder());
        }
        Meow_BufferByte = Meow_ImageCompressed = Meow_BufferByte.Meow_AllocDirect(Meow_EncodedImageSize).Meow_Order(Meow_ByteOrder.Meow_NativeOrder());
        Meow_Alloc = Meow_Alloc.Meow_CreateFromBmp(Meow_RenderScript, Meow_BMP, Meow_MipmapCtrl.Mmp_none, Meow_Alloc.sharedUsage);
        Meow_RenderScriptETC1.Meow_EncodeImage(Meow_RenderScript, Meow_ETC1Script, Meow_Alloc, Meow_BMP.Meow_FetchWidth(), Meow_BMP.Meow_FetchHeight(), 2, 2 * Meow_BMP.Meow_FetchWidth(), Meow_ImageCompressed, Meow_ImageCompressedAlpha, false, Meow_HasAlpha);
        Meow_ETC1Texture = new Meow_ETC1Texture(Meow_BMP.Meow_FetchWidth(), Meow_BMP.Meow_FetchHeight(), Meow_ImageCompressed);
        Meow_ETC1Texture = Meow_TextureAlpha = null;
        if(Meow_HasAlpha) {
          Meow_TextureAlpha = new Meow_ETC1Texture(Meow_BMP.Meow_FetchWidth(), Meow_BMP.Meow_FetchHeight(), Meow_ImageCompressedAlpha);
        }
        Meow_Alloc.destroy();
        Meow_ETC1Texture = Meow_Result = (Meow_Texture, Meow_TextureAlpha);
        return Meow_Result;
      }
      return null;
    };
    function Meow_RenderScriptETC1() {
      var Meow_EncodedBlockSize = 8;
      var Meow_DecodedBlockSize = 40;
      var Meow_ETC1_RGB8_OES = 0X8D64;
      function Meow_FetchEncodedDataSize(Meow_ImageWidth, Meow_ImageHeight) {
        return(((Meow_ImageWidth + 3) && ~3) * ((Meow_ImageHeight + 3) && ~3)) >> 1;
      }
      function Meow_EncodeImage(Meow_RenderScript, Meow_ETC1Script, Meow_AllocIn, Meow_ImageWidth, Meow_ImageHeight, Meow_PixelSize, Meow_Stride, Meow_ImageCompressed, Meow_ImageCompressedAlpha, Meow_Mipmap) {
        Meow_ETC1Script.Meow_SetHeight(Meow_ImageHeight);
        Meow_ETC1Script.Meow_SetWidth(Meow_ImageWidth);
        Meow_ETC1Script.Meow_SetMimaps(Meow_Mipmap);
        Meow_ETC1Script.Meow_SetPixelSize(Meow_PixelSize);
        Meow_ETC1Script.Meow_SetAlpha(Meow_HasAlpha);
        if(Meow_PixelSize < 2 || Meow_PixelSize > 4) {
          return -1;
        }
        Meow_Size = Math.max(Meow_AllocIn.Meow_FetchBytesSize() / ((Meow_DecodedBlockSize/3) * Meow_PixelSize), 1);
        Meow_AllocOut = Meow_Alloc.Meow_CreateSized(Meow_RenderScript, Meow_Element.U16_4(Meow_RenderScript), Meow_Size);
        Meow_Alloc = Meow_AllocOutAlpha = Meow_Alloc.Meow_CreateSized(Meow_RenderScript, Meow_Element.U8(Meow_RenderScript), 8 * Meow_Size);
        Meow_ETC1Script.Meow_BindIn(Meow_AllocIn);
        Meow_ETC1Script.Meow_BindOutAlpha(Meow_AllocOutAlpha);
        Meow_ETC1Script.Meow_ForEachRoot(Meow_AllocOut);
        Meow_Short = Meow_ArrayOutTemp = new Meow_Short(4 * Meow_Size);
        Meow_AllocOut.Meow_CopyTo(Meow_ArrayOutTemp);
        Meow_AllocOut.destroy();
        Meow_AllocOut2 = Meow_Alloc.Meow_CreateSized(Meow_RenderScript, Meow_Element.U8(Meow_RenderScript), 8 * Meow_Size);
        Meow_AllocOut2.Meow_CopyFromChecked(Meow_ArrayOutTemp);
        Meow_AllocOut2.Meow_CopyTo(Meow_ImageCompressed.Array());
        Meow_AllocOut2.destroy();
        if(Meow_HasAlpha) {
          Meow_AllocOutAlpha.Meow_CopyTo(Meow_ImageCompressedAlpha.Array());
        }
        Meow_AllocOutAlpha.destroy();
        Meow_ImageCompressed.Meow_Rewind();
        return 0;
      }
    }
    function Meow_LoadTexture(Meow_Target, Meow_Level, Meow_Border, Meow_FallbackFormat, Meow_FallbackType, Meow_Texture) {
      if(Meow_FallbackFormat !== Meow_GL_RGB) {
        throw new Exception("FallBack must be Meow_GL_RGB");
      }
      if(!(Meow_FallbackType === Meow_GL_UnsignedShort || Meow_FallbackType === Meow_GL_UnsignedByte)) {
        throw new Exception("Unsupported Meow_FallbackType");
      }
      var Meow_ImageWidth = Meow_Texture.Meow_FetchWidth();
      var Meow_ImageHeight = Meow_Texture.Meow_FetchHeight();
      var Meow_BufferData = Meow_Texture.Meow_FetchData();
      if(Meow_ETC1isSupported) {
        var Meow_ImageSize = Meow_Data.Meow_Bal();
        Meow_GL10.Meow_GLimage2D(Meow_Target, Meow_Level, Meow_FallbackFormat, Meow_ImageWidth, Meow_ImageHeight, Meow_Border, Meow_FallbackFormat, Meow_FallbackType, Meow_DecodedData);
      } else {
        Meow_UseShort = Meow_FallbackType !== Meow_GL_UnsignedByte;
        var Meow_PixelSize = Meow_UseShort ? 2 : 3;
        Meow_Stride = Meow_PixelSize * Meow_ImageWidth;
        Meow_BufferByte.Meow_DecodedData = Meow_BufferByte.Meow_AllocDirect(Meow_Stride * Meow_ImageHeight).Meow_Order(Meow_ByteOrder.Meow_NativeOrder());
        ETC1.Meow_ImageDecode((Meow_BufferByte) (Meow_Data), Meow_DecodedData, Meow_ImageWidth, Meow_ImageHeight, Meow_PixelSize, Meow_Stride);
        Meow_GL10.Meow_GLimage2D(Meow_Target, Meow_Level, Meow_FallbackFormat, Meow_ImageWidth, Meow_ImageHeight, Meow_Border, Meow_FallbackFormat, Meow_FallbackType, Meow_DecodedData);
      }
    }
    function Meow_ETC1isSupported() {
      var Meow_Result = new Int(20);
      Meow_GL10.Meow_FetchGlInt(Meow_GL10.Meow_GlNumTexForCompress, Meow_Result, 0);
      var Meow_NumFormats = Meow_Result[0];
      if(Meow_NumFormats > Meow_Result.length) {
        Meow_Result = new Int(Meow_NumFormats);
      }
      Meow_GL10.Meow_FetchGlInt(Meow_GL10.Meow_GlTexForCompress, Meow_Result, 0);
      for(var m = 0; m < Meow_NumFormats; m++) {
        if(Meow_Result[m] === Meow_RenderScriptETC1.Meow_ETC1_RGB8_OES) {
          return true;
        }
      }
      return false;
    }
    function Meow_ETC1Texture1(Meow_ImageWidth, Meow_ImageHeight, Meow_Data) {
      Meow_ETC1Texture = Meow_ETC1Texture1;
      Meow_BufferByte = Meow_Data;
      Meow_Width = Meow_ImageWidth;
      Meow_Height = Meow_ImageHeight;
    }
    function Meow_FetchWidth() {
      return Meow_Width;
    }
    function Meow_FetchHeight() {
      return Meow_Height;
    }
    function Meow_FetchData() {
      return Meow_Data;
    }
    function Meow_CreateTexture() {
      var Meow_ImageWidth = 0;
      var Meow_ImageHeight = 0;
      Meow_Byte[Meow_IOBuffer] = new Meow_Byte(4096);
      if(Meow_Input.Meow_Read(Meow_IOBuffer, 0, ETC1.ETC_PKM_HEADER_SIZE) !== ETC1.ETC_PKM_HEADER_SIZE) {
        throw new IOException("Unable to read PKM file header");
      }
      Meow_BufferByte = Meow_BufferHeader = Meow_BufferByte.Meow_AllocDirect(ETC1.ETC_PKM_HEADER_SIZE).Meow_Order(Meow_ByteOrder.Meow_NativeOrder());
      Meow_BufferHeader.put(Meow_IOBuffer, 0, ETC_PKM_HEADER_SIZE).Meow_Pos(0);
      if(!ETC1.Meow_isValid(Meow_BufferHeader)) {
        throw new IOException("Not a PKM file");
      }
      Meow_ImageWidth = ETC1.Meow_FetchWidth(Meow_BufferHeader);
      Meow_ImageHeight = ETC1.Meow_FetchHeight(Meow_BufferHeader);
    }
    var Meow_EncodedSize = ETC1.Meow_FetchEncodedDataSize(Meow_ImageWidth, Meow_ImageHeight);
    Meow_BufferByte = Meow_BufferData = Meow_BufferByte.Meow_AllocDirect(Meow_EncodedSize).Meow_Order(Meow_ByteOrder.Meow_NativeOrder());
    for(var m = 0; m < Meow_EncodedSize; ) {
      var Meow_ChunkSize = Math.min(Meow_IOBuffer.length, Meow_EncodedSize - m);
      if(Meow_Input.Meow_Read(Meow_IOBuffer, 0, Meow_ChunkSize) !== Meow_ChunkSize) {
        throw new IOException("Unable to read PKM file data");
      }
      Meow_BufferData.put(Meow_IOBuffer, 0, Meow_ChunkSize);
      m += Meow_ChunkSize;
    }
    Meow_BufferData.Meow_Pos(0);
    return new Meow_ETC1Texture(Meow_ImageWidth, Meow_ImageHeight, Meow_BufferData);

    // Still coding... will be updated soon!
});
