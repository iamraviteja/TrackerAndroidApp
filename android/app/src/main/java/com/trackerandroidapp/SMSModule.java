package com.trackerandroidapp;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;
import com.facebook.react.bridge.Callback;

import androidx.annotation.RequiresApi;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;

import org.json.JSONArray;
import org.json.JSONObject;

public class SMSModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext context;
    SMSModule(ReactApplicationContext context) {
        super(context);
        this.context = context;
    }

    // add to SMSModule.java
    @Override
    public String getName() {
        return "SMSModule";
    }

    private JSONObject getJsonFromCursor(Cursor cur) {
        JSONObject json = new JSONObject();

        int nCol = cur.getColumnCount();
        String[] keys = cur.getColumnNames();
        try {
            for (int j = 0; j < nCol; j++)
                switch (cur.getType(j)) {
                    case Cursor.FIELD_TYPE_NULL:
                        json.put(keys[j], null);
                        break;
                    case Cursor.FIELD_TYPE_INTEGER:
                        json.put(keys[j], cur.getLong(j));
                        break;
                    case Cursor.FIELD_TYPE_FLOAT:
                        json.put(keys[j], cur.getFloat(j));
                        break;
                    case Cursor.FIELD_TYPE_STRING:
                        json.put(keys[j], cur.getString(j));
                        break;
                    case Cursor.FIELD_TYPE_BLOB:
                        json.put(keys[j], cur.getBlob(j));
                }
        } catch (Exception e) {
            return null;
        }

        return json;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @ReactMethod
    public void readSMS(final  Callback success, final Callback error){
        if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_SMS) == PackageManager.PERMISSION_GRANTED){
            Cursor cursor = context.getContentResolver().query(Uri.parse("content://sms/inbox"),null,null,null);

            JSONArray jsons = new JSONArray();
            while (cursor != null && cursor.moveToNext()){
                JSONObject json;
                json = getJsonFromCursor(cursor);
                jsons.put(json);
            }
            cursor.close();
            try {
                success.invoke(jsons.toString());
            } catch (Exception e) {
                error.invoke(e.getMessage());
            }
        }else{
            error.invoke("Requires SMS Permissions.");
        }

    }
}

