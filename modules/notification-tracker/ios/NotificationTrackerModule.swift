import ExpoModulesCore

public class NotificationTrackerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("NotificationTracker")

    Function("getTrackedNotifications") { () -> [String] in
      return []
    }
  }
}
